import type { Metadata } from "next";
import { Inbox, Wand2, FolderKanban, MessageSquareQuote, HelpCircle, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/admin/stat-card";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

async function getCount(
  supabase: Awaited<ReturnType<typeof createClient>>,
  table: "leads" | "contact_submissions" | "visualization_requests" | "portfolio_items" | "testimonials" | "faq_items",
  filter?: Record<string, string | number | boolean>
) {
  let query = supabase.from(table).select("*", { count: "exact", head: true });
  if (filter) {
    for (const [key, value] of Object.entries(filter)) {
      query = query.eq(key, value);
    }
  }
  const { count } = await query;
  return count ?? 0;
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    totalLeads,
    unhandledLeads,
    totalInquiries,
    unhandledInquiries,
    totalVisualizations,
    failedVisualizations,
    totalProjects,
    totalTestimonials,
    totalFaqs,
  ] = await Promise.all([
    getCount(supabase, "leads"),
    getCount(supabase, "leads", { is_handled: false }),
    getCount(supabase, "contact_submissions"),
    getCount(supabase, "contact_submissions", { is_handled: false }),
    getCount(supabase, "visualization_requests"),
    getCount(supabase, "visualization_requests", { status: "failed" }),
    getCount(supabase, "portfolio_items"),
    getCount(supabase, "testimonials"),
    getCount(supabase, "faq_items"),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">An overview of activity across the site.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={Inbox}
          label="Contact & quote inquiries"
          value={totalInquiries}
          hint={`${unhandledInquiries} unhandled`}
          href="/admin/leads?tab=inquiries"
        />
        <StatCard
          icon={Inbox}
          label="Visualizer leads"
          value={totalLeads}
          hint={`${unhandledLeads} unhandled`}
          href="/admin/leads?tab=leads"
        />
        <StatCard
          icon={Wand2}
          label="Visualizations generated"
          value={totalVisualizations}
          hint={`${failedVisualizations} failed`}
          href="/admin/visualizations"
        />
        <StatCard icon={FolderKanban} label="Portfolio projects" value={totalProjects} href="/admin/projects" />
        <StatCard icon={MessageSquareQuote} label="Testimonials" value={totalTestimonials} href="/admin/testimonials" />
        <StatCard icon={HelpCircle} label="FAQ items" value={totalFaqs} href="/admin/faqs" />
      </div>

      {unhandledInquiries + unhandledLeads > 0 ? (
        <div className="flex items-start gap-3 rounded-xl border border-gold/30 bg-gold/10 p-5 text-sm text-foreground/90">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
          You have {unhandledInquiries + unhandledLeads} unhandled submission
          {unhandledInquiries + unhandledLeads === 1 ? "" : "s"} waiting for review.
        </div>
      ) : null}
    </div>
  );
}
