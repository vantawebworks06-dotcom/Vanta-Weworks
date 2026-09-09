import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Inbox, Wand2, FolderKanban, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/admin/logout-button";
import type { WebsiteConcept } from "@/lib/validations/concept";

export const metadata: Metadata = {
  title: "My Dashboard",
  robots: { index: false, follow: false },
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function StatusPill({ handled }: { handled: boolean }) {
  return (
    <span
      className={
        handled
          ? "rounded-full border border-accent-2/40 bg-accent-2/10 px-2.5 py-0.5 text-[11px] font-medium text-accent-2"
          : "rounded-full border border-gold/40 bg-gold/10 px-2.5 py-0.5 text-[11px] font-medium text-gold"
      }
    >
      {handled ? "In progress" : "Received"}
    </span>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/dashboard");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  const [{ data: inquiries }, { data: leads }, { data: concepts }] = await Promise.all([
    supabase
      .from("contact_submissions")
      .select("id, service_interested, message, is_handled, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("leads")
      .select("id, project_description, is_handled, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("visualization_requests")
      .select("id, business_name, style, status, created_at, config")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const displayName = profile?.full_name || user.email?.split("@")[0] || "there";

  return (
    <div className="py-16 sm:py-20">
      <Container className="max-w-5xl">
        <div className="flex flex-col gap-4 border-b border-border pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Badge>My Account</Badge>
            <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Welcome back, {displayName}
            </h1>
            <p className="mt-2 text-sm text-muted">{user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            {profile?.role === "admin" ? (
              <Button href="/admin" variant="outline" size="sm">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                Admin Dashboard
              </Button>
            ) : null}
            <LogoutButton />
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Inquiries */}
          <Card className="flex flex-col gap-4 p-6">
            <div className="flex items-center gap-2">
              <Inbox className="h-4 w-4 text-accent-2" aria-hidden="true" />
              <h2 className="font-display text-base font-semibold">Your Inquiries</h2>
            </div>
            {!inquiries || inquiries.length === 0 ? (
              <p className="text-sm text-muted">
                No inquiries yet.{" "}
                <Link href="/contact" className="font-medium text-foreground underline underline-offset-4">
                  Start a project
                </Link>{" "}
                to send us one.
              </p>
            ) : (
              <ul className="flex flex-col divide-y divide-border">
                {inquiries.map((row) => (
                  <li key={row.id} className="flex items-start justify-between gap-3 py-3">
                    <div>
                      <p className="text-sm text-foreground">{row.service_interested || "General inquiry"}</p>
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted">{row.message}</p>
                      <p className="mt-1 text-[11px] text-muted">{formatDate(row.created_at)}</p>
                    </div>
                    <StatusPill handled={row.is_handled} />
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* Project leads (post-visualizer) */}
          <Card className="flex flex-col gap-4 p-6">
            <div className="flex items-center gap-2">
              <FolderKanban className="h-4 w-4 text-accent-2" aria-hidden="true" />
              <h2 className="font-display text-base font-semibold">Your Project Submissions</h2>
            </div>
            {!leads || leads.length === 0 ? (
              <p className="text-sm text-muted">
                No project submissions yet.{" "}
                <Link href="/visualizer" className="font-medium text-foreground underline underline-offset-4">
                  Try the AI Visualizer
                </Link>{" "}
                to get started.
              </p>
            ) : (
              <ul className="flex flex-col divide-y divide-border">
                {leads.map((row) => (
                  <li key={row.id} className="flex items-start justify-between gap-3 py-3">
                    <div>
                      <p className="line-clamp-1 text-sm text-foreground">{row.project_description || "Project submission"}</p>
                      <p className="mt-1 text-[11px] text-muted">{formatDate(row.created_at)}</p>
                    </div>
                    <StatusPill handled={row.is_handled} />
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* Visualizer concepts */}
          <Card className="flex flex-col gap-4 p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wand2 className="h-4 w-4 text-accent-2" aria-hidden="true" />
                <h2 className="font-display text-base font-semibold">Your AI Visualizer Concepts</h2>
              </div>
              <Button href="/visualizer" variant="outline" size="sm">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                New Concept
              </Button>
            </div>

            {!concepts || concepts.length === 0 ? (
              <p className="text-sm text-muted">
                You haven&apos;t generated a website concept yet.{" "}
                <Link href="/visualizer" className="font-medium text-foreground underline underline-offset-4">
                  Try the AI Visualizer
                </Link>
                .
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {concepts.map((row) => {
                  const config = row.config as WebsiteConcept | null;
                  return (
                    <Link
                      key={row.id}
                      href={row.status === "completed" ? `/dashboard/concepts/${row.id}` : "#"}
                      className={
                        row.status === "completed"
                          ? "group flex flex-col gap-3 rounded-xl border border-border p-4 transition-colors hover:border-border-strong"
                          : "flex flex-col gap-3 rounded-xl border border-border p-4 opacity-60"
                      }
                    >
                      {config ? (
                        <div className="flex gap-1.5">
                          <span className="h-4 w-4 rounded-full border border-white/20" style={{ background: config.theme.primaryColor }} />
                          <span className="h-4 w-4 rounded-full border border-white/20" style={{ background: config.theme.secondaryColor }} />
                        </div>
                      ) : null}
                      <p className="text-sm font-medium text-foreground">{row.business_name || "Untitled concept"}</p>
                      {row.style ? <p className="text-xs capitalize text-muted">{row.style}</p> : null}
                      <div className="mt-auto flex items-center justify-between">
                        <p className="text-[11px] text-muted">{formatDate(row.created_at)}</p>
                        {row.status === "completed" ? (
                          <ArrowRight className="h-3.5 w-3.5 text-muted transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                        ) : (
                          <span className="text-[11px] capitalize text-muted">{row.status}</span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </Container>
    </div>
  );
}
