import { NextResponse } from "next/server";
import { visualizeRequestSchema } from "@/lib/validations/visualizer";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { moderateText } from "@/lib/ai/moderation";
import { generateWebsiteConcept } from "@/lib/ai/concept";
import {
  AiConfigError,
  AiModerationError,
  AiProviderError,
  AiRateLimitError,
  AiTimeoutError,
  AiValidationError,
  formatRetryMessage,
} from "@/lib/ai/errors";

// Moderation + concept generation can each take a couple of retried/backed-off
// AI calls (see src/lib/ai/errors.ts) — give this route more headroom than
// the platform default so a slow-but-succeeding request isn't cut off.
export const maxDuration = 60;

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);

  const { success } = rateLimit(`visualize:${ip}`, { limit: 10, windowMs: 60 * 60 * 1000 });
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

  const sessionClient = await createClient();
  const {
    data: { user },
  } = await sessionClient.auth.getUser();

  const { data: requestRow, error: insertError } = await admin
    .from("visualization_requests")
    .insert({
      business_name: input.businessName,
      description: input.description,
      industry: input.industry || null,
      style: input.style || null,
      colors: input.colors || null,
      features: input.features || null,
      status: "pending",
      user_id: user?.id ?? null,
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

  const combinedText = [input.businessName, input.description, input.industry, input.style, input.colors, input.features]
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
    if (err instanceof AiConfigError) {
      return NextResponse.json(
        { error: "The AI Visualizer isn't configured yet. Please try again later." },
        { status: 503 }
      );
    }
    if (err instanceof AiRateLimitError) {
      return NextResponse.json({ error: formatRetryMessage(err.retryAfterMs) }, { status: 429 });
    }
    return NextResponse.json(
      { error: "The AI Visualizer isn't available right now. Please try again shortly." },
      { status: 503 }
    );
  }

  try {
    const concept = await generateWebsiteConcept(input);

    await admin
      .from("visualization_requests")
      .update({ status: "completed", config: concept })
      .eq("id", requestId);

    return NextResponse.json({ requestId, concept });
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
    if (err instanceof AiValidationError) {
      return NextResponse.json(
        { error: "We couldn't generate a valid concept from that description. Please try rephrasing it." },
        { status: 502 }
      );
    }
    if (err instanceof AiRateLimitError) {
      return NextResponse.json({ error: formatRetryMessage(err.retryAfterMs) }, { status: 429 });
    }
    if (err instanceof AiProviderError) {
      return NextResponse.json(
        { error: "The AI service couldn't generate a concept right now. Please try again shortly." },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong generating your concept. Please try again." },
      { status: 500 }
    );
  }
}
