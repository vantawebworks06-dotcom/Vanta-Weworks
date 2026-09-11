import type { Metadata } from "next";
import { CheckCircle2, XCircle } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Card } from "@/components/ui/card";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Settings",
  robots: { index: false, follow: false },
};

function StatusRow({ label, configured, hint }: { label: string; configured: boolean; hint?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-3 last:border-0">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        {hint ? <p className="text-xs text-muted">{hint}</p> : null}
      </div>
      {configured ? (
        <span className="flex items-center gap-1.5 text-xs font-medium text-accent-2">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          Configured
        </span>
      ) : (
        <span className="flex items-center gap-1.5 text-xs font-medium text-muted">
          <XCircle className="h-4 w-4" aria-hidden="true" />
          Not set
        </span>
      )}
    </div>
  );
}

export default function AdminSettingsPage() {
  const envStatus = [
    {
      label: "Supabase URL & anon key",
      configured: !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hint: "NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY",
    },
    {
      label: "Supabase service role key",
      configured: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hint: "SUPABASE_SERVICE_ROLE_KEY — required for the AI Visualizer to save requests/leads",
    },
    {
      label: "Groq API key",
      configured: !!process.env.GROQ_API_KEY,
      hint: "GROQ_API_KEY — required for the AI Visualizer to generate and edit concepts",
    },
    {
      label: "Contact email",
      configured: !!siteConfig.contact.email,
      hint: "NEXT_PUBLIC_CONTACT_EMAIL",
    },
    {
      label: "Contact phone",
      configured: !!siteConfig.contact.phone,
      hint: "NEXT_PUBLIC_CONTACT_PHONE",
    },
    {
      label: "WhatsApp number",
      configured: !!siteConfig.contact.whatsapp,
      hint: "NEXT_PUBLIC_WHATSAPP_NUMBER",
    },
    {
      label: "Site URL",
      configured: !!process.env.NEXT_PUBLIC_SITE_URL,
      hint: "NEXT_PUBLIC_SITE_URL — used for metadata, Open Graph, and the sitemap",
    },
  ];

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <AdminPageHeader
        title="Settings"
        description="Configuration status for this deployment. Values themselves are never shown here — only whether each is set."
      />

      <Card className="p-6">
        <h2 className="font-display text-base font-semibold">Environment</h2>
        <div className="mt-2">
          {envStatus.map((row) => (
            <StatusRow key={row.label} {...row} />
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="font-display text-base font-semibold">Managing admin access</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          New accounts start with standard (non-admin) access. To grant someone admin access,
          run this in the Supabase SQL editor after they&apos;ve signed up (find their user ID
          under Authentication &rarr; Users):
        </p>
        <pre className="mt-3 overflow-x-auto rounded-lg border border-border bg-black/40 p-4 text-xs text-foreground/85">
          {"update public.profiles set role = 'admin' where id = '<user-uuid>';"}
        </pre>
      </Card>
    </div>
  );
}
