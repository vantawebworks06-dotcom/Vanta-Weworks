import { NextResponse } from "next/server";
import { leadCaptureSchema } from "@/lib/validations/visualizer";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { sendEmail, escapeHtml } from "@/lib/email/send-email";

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

  const { name, email, phone, business, projectDescription, budgetRange, timeline, visualizationRequestId } =
    parsed.data;

  // Read the visitor's own session (if any) via the regular cookie-based
  // client — separate from `admin`, which is the service-role client used
  // for the actual write since this table has no public insert policy.
  const sessionClient = await createClient();
  const {
    data: { user },
  } = await sessionClient.auth.getUser();

  const { error } = await admin.from("leads").insert({
    name,
    email,
    phone: phone || null,
    business: business || null,
    project_description: projectDescription || null,
    budget_range: budgetRange || null,
    timeline: timeline || null,
    visualization_request_id: visualizationRequestId || null,
    user_id: user?.id ?? null,
  });

  if (error) {
    console.error("Failed to store lead:", error.message);
    return NextResponse.json(
      { error: "Something went wrong on our end. Please try again shortly." },
      { status: 500 }
    );
  }

  const notifyAddress = process.env.CONTACT_EMAIL;
  if (notifyAddress) {
    void sendEmail({
      to: notifyAddress,
      subject: `New AI Visualizer lead from ${name}`,
      html: `
        <h2>New AI Visualizer lead</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ""}
        ${business ? `<p><strong>Business:</strong> ${escapeHtml(business)}</p>` : ""}
        ${budgetRange ? `<p><strong>Budget:</strong> ${escapeHtml(budgetRange)}</p>` : ""}
        ${timeline ? `<p><strong>Timeline:</strong> ${escapeHtml(timeline)}</p>` : ""}
        ${projectDescription ? `<p><strong>Notes:</strong></p><p>${escapeHtml(projectDescription).replace(/\n/g, "<br />")}</p>` : ""}
      `,
    });
  }

  return NextResponse.json({ ok: true });
}
