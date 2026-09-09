import { NextResponse } from "next/server";
import { leadCaptureSchema } from "@/lib/validations/visualizer";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);
  const { success } = rateLimit(`leads:${ip}`, { limit: 8, windowMs: 10 * 60 * 1000 });
  if (!success) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = leadCaptureSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form for errors.", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  if (parsed.data.companyWebsite) {
    return NextResponse.json({ ok: true });
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return NextResponse.json(
      { error: "This form isn't available right now. Please use the Contact page instead." },
      { status: 503 }
    );
  }

  const { name, email, phone, business, projectDescription, visualizationRequestId } = parsed.data;

  const { error } = await admin.from("leads").insert({
    name,
    email,
    phone: phone || null,
    business: business || null,
    project_description: projectDescription || null,
    visualization_request_id: visualizationRequestId || null,
  });

  if (error) {
    console.error("Failed to store lead:", error.message);
    return NextResponse.json(
      { error: "Something went wrong on our end. Please try again shortly." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
