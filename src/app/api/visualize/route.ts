import { NextResponse } from "next/server";
import { visualizeRequestSchema } from "@/lib/validations/visualizer";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  moderateText,
  generateConceptImage,
  AiConfigError,
  AiModerationError,
  AiProviderError,
  AiTimeoutError,
} from "@/lib/ai/openai-image";

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);

  // Image generation costs real money per call, so this window is tighter
  // than the plain contact-form limiter.
  const { success } = rateLimit(`visualize:${ip}`, { limit: 6, windowMs: 60 * 60 * 1000 });
  if (!success) {
    return NextResponse.json(
      { error: "You've reached the generation limit for now. Please try again later." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = visualizeRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check your description and try again.", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const input = parsed.data;

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return NextResponse.json(
      { error: "The AI Visualizer isn't configured yet. Please try again later." },
      { status: 503 }
    );
  }

  // Record the attempt up front (status "pending"), then update it in place
  // as the request progresses — one row per attempt, never duplicated.
  const { data: requestRow, error: insertError } = await admin
    .from("visualization_requests")
    .insert({
      description: input.description,
      industry: input.industry || null,
      style: input.style || null,
      colors: input.colors || null,
      target_audience: input.targetAudience || null,
      features: input.features || null,
      status: "pending",
    })
    .select("id")
    .single();

  if (insertError || !requestRow) {
    console.error("Failed to record visualization request:", insertError?.message);
    return NextResponse.json(
      { error: "Something went wrong on our end. Please try again shortly." },
      { status: 500 }
    );
  }

  const requestId = requestRow.id;

  const fail = async (errorMessage: string) => {
    await admin
      .from("visualization_requests")
      .update({ status: "failed", error_message: errorMessage.slice(0, 500) })
      .eq("id", requestId);
  };

  const combinedText = [input.description, input.industry, input.style, input.colors, input.targetAudience, input.features]
    .filter(Boolean)
    .join(" \n ");

  try {
    await moderateText(combinedText);
  } catch (err) {
    if (err instanceof AiModerationError) {
      await fail("Content did not pass moderation.");
      return NextResponse.json(
        { error: "Please revise your description — it couldn't be processed as written." },
        { status: 422 }
      );
    }
    console.error("Moderation check failed:", err);
    await fail(err instanceof Error ? err.message : "Moderation check failed.");
    return NextResponse.json(
      { error: "The AI Visualizer isn't available right now. Please try again shortly." },
      { status: 503 }
    );
  }

  try {
    const { imageBytes, promptUsed } = await generateConceptImage(input);

    const imagePath = `${requestId}.png`;
    const { error: uploadError } = await admin.storage
      .from("concepts")
      .upload(imagePath, imageBytes, { contentType: "image/png", upsert: true });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    await admin.from("generated_concepts").insert({
      visualization_request_id: requestId,
      image_path: imagePath,
    });

    await admin
      .from("visualization_requests")
      .update({ status: "completed", prompt_used: promptUsed })
      .eq("id", requestId);

    const { data: publicUrlData } = admin.storage.from("concepts").getPublicUrl(imagePath);

    return NextResponse.json({
      requestId,
      imageUrl: publicUrlData.publicUrl,
      promptUsed,
    });
  } catch (err) {
    console.error("Visualizer generation failed:", err);
    await fail(err instanceof Error ? err.message : "Unknown error");

    if (err instanceof AiConfigError) {
      return NextResponse.json(
        { error: "The AI Visualizer isn't configured yet. Please try again later." },
        { status: 503 }
      );
    }
    if (err instanceof AiTimeoutError) {
      return NextResponse.json(
        { error: "That took too long to generate. Please try again." },
        { status: 504 }
      );
    }
    if (err instanceof AiProviderError) {
      return NextResponse.json(
        { error: "The AI service couldn't generate an image right now. Please try again shortly." },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong generating your concept. Please try again." },
      { status: 500 }
    );
  }
}
