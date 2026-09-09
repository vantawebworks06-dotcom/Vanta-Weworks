import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AdminTable, AdminTableEmpty } from "@/components/admin/admin-table";
import { HandledToggle } from "@/components/admin/handled-toggle";
import { cn } from "@/lib/utils/cn";
import { toggleContactHandled, toggleLeadHandled } from "./actions";

export const metadata: Metadata = {
  title: "Leads & Inquiries",
  robots: { index: false, follow: false },
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const activeTab = tab === "leads" ? "leads" : "inquiries";

  const supabase = await createClient();

  const [{ data: inquiries }, { data: visualizerLeads }] = await Promise.all([
    supabase
      .from("contact_submissions")
      .select("id, name, email, company, service_interested, budget_range, message, is_handled, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("leads")
      .select("id, name, email, business, project_description, is_handled, created_at")
      .order("created_at", { ascending: false }),
  ]);

  const tabs = [
    { key: "inquiries", label: "Contact & Quote Inquiries", count: inquiries?.length ?? 0 },
    { key: "leads", label: "Visualizer Leads", count: visualizerLeads?.length ?? 0 },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Leads &amp; Inquiries</h1>
        <p className="mt-1 text-sm text-muted">
          Contact form submissions (which also serve as quote requests) and leads captured
          through the AI Visualizer.
        </p>
      </div>

      <div className="flex gap-2 border-b border-border">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={`/admin/leads?tab=${t.key}`}
            className={cn(
              "border-b-2 px-1 pb-3 text-sm font-medium transition-colors",
              activeTab === t.key
                ? "border-accent-2 text-foreground"
                : "border-transparent text-muted hover:text-foreground"
            )}
          >
            {t.label} <span className="text-xs text-muted">({t.count})</span>
          </Link>
        ))}
      </div>

      {activeTab === "inquiries" ? (
        <AdminTable>
          <thead>
            <tr className="border-b border-border bg-white/[0.02] text-xs uppercase tracking-wide text-muted">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Service / Budget</th>
              <th className="px-5 py-3 font-medium">Message</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {!inquiries || inquiries.length === 0 ? (
              <AdminTableEmpty colSpan={5}>No inquiries yet.</AdminTableEmpty>
            ) : (
              inquiries.map((row) => (
                <tr key={row.id} className="align-top">
                  <td className="px-5 py-4">
                    <p className="font-medium text-foreground">{row.name}</p>
                    <p className="text-xs text-muted">{row.email}</p>
                    {row.company ? <p className="text-xs text-muted">{row.company}</p> : null}
                  </td>
                  <td className="px-5 py-4 text-xs text-muted">
                    {row.service_interested ? <p>{row.service_interested}</p> : null}
                    {row.budget_range ? <p>{row.budget_range}</p> : null}
                  </td>
                  <td className="max-w-xs px-5 py-4 text-xs text-foreground/85">
                    <p className="line-clamp-3">{row.message}</p>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-xs text-muted">
                    {formatDate(row.created_at)}
                  </td>
                  <td className="px-5 py-4">
                    <HandledToggle id={row.id} initialHandled={row.is_handled} action={toggleContactHandled} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </AdminTable>
      ) : (
        <AdminTable>
          <thead>
            <tr className="border-b border-border bg-white/[0.02] text-xs uppercase tracking-wide text-muted">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Business</th>
              <th className="px-5 py-3 font-medium">Details</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {!visualizerLeads || visualizerLeads.length === 0 ? (
              <AdminTableEmpty colSpan={5}>No visualizer leads yet.</AdminTableEmpty>
            ) : (
              visualizerLeads.map((row) => (
                <tr key={row.id} className="align-top">
                  <td className="px-5 py-4">
                    <p className="font-medium text-foreground">{row.name}</p>
                    <p className="text-xs text-muted">{row.email}</p>
                  </td>
                  <td className="px-5 py-4 text-xs text-muted">{row.business ?? "—"}</td>
                  <td className="max-w-xs px-5 py-4 text-xs text-foreground/85">
                    <p className="line-clamp-3">{row.project_description ?? "—"}</p>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-xs text-muted">
                    {formatDate(row.created_at)}
                  </td>
                  <td className="px-5 py-4">
                    <HandledToggle id={row.id} initialHandled={row.is_handled} action={toggleLeadHandled} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </AdminTable>
      )}
    </div>
  );
}
