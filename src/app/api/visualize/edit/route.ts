import { NextResponse } from "next/server";
import { editConceptSchema } from "@/lib/validations/visualizer";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";
import { moderateText } from "@/lib/ai/moderation";
import { editWebsiteConcept } from "@/lib/ai/concept";
import {
  AiConfigError,
  AiModerationError,
  AiProviderError,
  AiRateLimitError,
  AiTimeoutError,
  AiValidationError,
  formatRetryMessage,
} from "@/lib/ai/errors";

// See src/app/api/visualize/route.ts for why this needs more than the
// platform default.
export const maxDuration = 60;

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);

  // Edits are cheaper than a full generation but still call the AI —
  // a slightly more generous window than initial generation.
  const { success } = rateLimit(`visualize-edit:${ip}`, { limit: 30, windowMs: 60 * 60 * 1000 });
  if (!success) {
    return NextResponse.json(
      { error: "You've made a lot of changes — please slow down a little and try again shortly." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = editConceptSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "That request wasn't formatted correctly. Please try again." },
      { status: 422 }
    );
  }

  const { requestId, instruction, currentConcept } = parsed.data;

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return NextResponse.json(
      { error: "The AI Visualizer isn't configured yet. Please try again later." },
      { status: 503 }
    );
  }

  // Confirm the session exists (defends against edit requests for an id
  // that was never created through /api/visualize).
  const { data: sessionRow } = await admin
    .from("visualization_requests")
    .select("id, edit_count")
    .eq("id", requestId)
    .maybeSingle();

  if (!sessionRow) {
    return NextResponse.json({ error: "This session has expired. Please start a new concept." }, { status: 404 });
  }

  try {
    await moderateText(instruction);
  } catch (err) {
    if (err instanceof AiModerationError) {
      return NextResponse.json(
        { error: "Please rephrase that request." },
        { status: 422 }
      );
    }
    console.error("Moderation check failed:", err);
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
    const concept = await editWebsiteConcept(currentConcept, instruction);

    await admin
      .from("visualization_requests")
      .update({ config: concept, edit_count: (sessionRow.edit_count ?? 0) + 1 })
      .eq("id", requestId);

    return NextResponse.json({ concept });
  } catch (err) {
    console.error("Visualizer edit failed:", err);

    if (err instanceof AiConfigError) {
      return NextResponse.json(
        { error: "The AI Visualizer isn't configured yet. Please try again later." },
        { status: 503 }
      );
    }
    if (err instanceof AiTimeoutError) {
      return NextResponse.json(
        { error: "That took too long to apply. Please try again." },
        { status: 504 }
      );
    }
    if (err instanceof AiValidationError) {
      return NextResponse.json(
        { error: "We couldn't apply that change cleanly. Please try rephrasing it." },
        { status: 502 }
      );
    }
    if (err instanceof AiRateLimitError) {
      return NextResponse.json({ error: formatRetryMessage(err.retryAfterMs) }, { status: 429 });
    }
    if (err instanceof AiProviderError) {
      return NextResponse.json(
        { error: "The AI service couldn't apply that change right now. Please try again shortly." },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong applying that change. Please try again." },
      { status: 500 }
    );
  }
}
