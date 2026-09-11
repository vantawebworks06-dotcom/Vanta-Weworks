import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PreviewRenderer } from "@/components/visualizer/preview/preview-renderer";
import { websiteConceptSchema } from "@/lib/validations/concept";

export const metadata: Metadata = {
  title: "Your Concept",
  robots: { index: false, follow: false },
};

export default async function DashboardConceptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirectTo=/dashboard/concepts/${id}`);
  }

  // RLS already scopes this to rows the caller owns (or is admin for), but
  // the explicit .eq keeps the query's intent obvious regardless.
  const { data: row } = await supabase
    .from("visualization_requests")
    .select("id, business_name, config, created_at")
    .eq("id", id)
    .maybeSingle();

  if (!row || !row.config) notFound();

  const parsed = websiteConceptSchema.safeParse(row.config);
  if (!parsed.success) notFound();

  return (
    <div className="py-16 sm:py-20">
      <Container className="max-w-5xl">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Back to dashboard
        </Link>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Badge>Saved Concept</Badge>
            <h1 className="mt-4 font-display text-2xl font-semibold sm:text-3xl">{row.business_name}</h1>
            <p className="mt-1 text-sm text-muted">
              Generated {new Date(row.created_at).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <Button href="/contact" variant="gradient" size="md">
            Start This Project
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        <div className="mt-8 flex items-start gap-3 rounded-xl border border-border bg-surface/40 p-4 text-sm text-muted">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent-2" aria-hidden="true" />
          <p>
            <span className="font-medium text-foreground">AI Preview</span> — this is a visual
            concept, not the final website. Your finished website will be customized and refined
            based on your business, branding, content, features, and requirements.
          </p>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-border shadow-2xl">
          <PreviewRenderer concept={parsed.data} />
        </div>

        <div className="mt-8 flex justify-center">
          <Button href="/visualizer" variant="outline" size="md">
            Generate a New Concept
          </Button>
        </div>
      </Container>
    </div>
  );
}
