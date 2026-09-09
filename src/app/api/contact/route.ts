import { NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validations/contact";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { sendEmail, escapeHtml } from "@/lib/email/send-email";

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);
  const { success } = rateLimit(`contact:${ip}`, { limit: 5, windowMs: 10 * 60 * 1000 });
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

  const parsed = contactFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form for errors.", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  // Honeypot: a real visitor never fills this hidden field in.
  if (parsed.data.companyWebsite) {
    return NextResponse.json({ ok: true });
  }

  const { name, email, phone, company, websiteUrl, serviceInterested, budgetRange, preferredTimeline, message } =
    parsed.data;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("contact_submissions").insert({
    name,
    email,
    phone: phone || null,
    company: company || null,
    website_url: websiteUrl || null,
    service_interested: serviceInterested || null,
    budget_range: budgetRange || null,
    preferred_timeline: preferredTimeline || null,
    message,
    user_id: user?.id ?? null,
  });

  if (error) {
    console.error("Failed to store contact submission:", error.message);
    return NextResponse.json(
      { error: "Something went wrong on our end. Please try again shortly." },
      { status: 500 }
    );
  }

  // Best-effort notifications — sendEmail() no-ops safely if RESEND_API_KEY
  // isn't configured, and never throws, so this never blocks the response.
  const notifyAddress = process.env.CONTACT_EMAIL;
  if (notifyAddress) {
    void sendEmail({
      to: notifyAddress,
      subject: `New inquiry from ${name}`,
      html: `
        <h2>New contact/quote inquiry</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ""}
        ${company ? `<p><strong>Company:</strong> ${escapeHtml(company)}</p>` : ""}
        ${websiteUrl ? `<p><strong>Website:</strong> ${escapeHtml(websiteUrl)}</p>` : ""}
        ${serviceInterested ? `<p><strong>Service:</strong> ${escapeHtml(serviceInterested)}</p>` : ""}
        ${budgetRange ? `<p><strong>Budget:</strong> ${escapeHtml(budgetRange)}</p>` : ""}
        ${preferredTimeline ? `<p><strong>Timeline:</strong> ${escapeHtml(preferredTimeline)}</p>` : ""}
        <p><strong>Project description:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
      `,
    });
  }

  void sendEmail({
    to: email,
    subject: "We've received your project inquiry — Vanta Webworks",
    html: `
      <p>Hi ${escapeHtml(name)},</p>
      <p>Thanks for reaching out to Vanta Webworks. We've received your project details and
      will follow up within one business day.</p>
      <p>— The Vanta Webworks team</p>
    `,
  });

  return NextResponse.json({ ok: true });
}
