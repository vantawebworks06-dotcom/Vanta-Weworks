import "server-only";

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
};

/**
 * Sends a transactional email via the Resend REST API. This is a real,
 * wired code path — but it no-ops (logs and returns) when RESEND_API_KEY
 * isn't set, so contact/lead submissions still succeed and get stored even
 * before an email provider is configured.
 *
 * Uses a plain fetch call rather than the `resend` SDK to avoid adding a
 * dependency for what is a single REST call.
 */
export async function sendEmail({ to, subject, html }: SendEmailInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "Vanta Webworks <onboarding@resend.dev>";

  if (!apiKey) {
    console.info(`[email] Not configured (RESEND_API_KEY unset) — skipping email to ${to}: "${subject}"`);
    return;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error(`[email] Send failed (${response.status}): ${body.slice(0, 300)}`);
    }
  } catch (err) {
    // Email delivery is best-effort — never let a failure here break the
    // form submission it was triggered by.
    console.error("[email] Send threw an error:", err);
  }
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
