import { NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validations/contact";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

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
  });

  if (error) {
    console.error("Failed to store contact submission:", error.message);
    return NextResponse.json(
      { error: "Something went wrong on our end. Please try again shortly." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
