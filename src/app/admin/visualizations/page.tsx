import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import type { WebsiteConcept } from "@/lib/validations/concept";

export const metadata: Metadata = {
  title: "Visualizations",
  robots: { index: false, follow: false },
};

const statusStyles: Record<string, string> = {
  completed: "border-accent-2/40 bg-accent-2/10 text-accent-2",
  pending: "border-gold/40 bg-gold/10 text-gold",
  failed: "border-red-500/40 bg-red-500/10 text-red-300",
};

export default async function VisualizationsPage() {
  const supabase = await createClient();

  const { data: requests } = await supabase
    .from("visualization_requests")
    .select("id, business_name, description, industry, style, status, error_message, edit_count, config, created_at")
    .order("created_at", { ascending: false })
    .limit(60);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">AI Visualizer Requests</h1>
        <p className="mt-1 text-sm text-muted">
          Every website concept generated through the public /visualizer tool, most recent first.
        </p>
      </div>

      {!requests || requests.length === 0 ? (
        <Card className="p-10 text-center text-sm text-muted">No visualizations yet.</Card>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {requests.map((req) => {
            const config = req.config as WebsiteConcept | null;
            return (
              <Card key={req.id} className="flex flex-col gap-3 p-5">
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide",
                      statusStyles[req.status] ?? statusStyles.pending
                    )}
                  >
                    {req.status}
                  </span>
                  <span className="text-[11px] text-muted">{new Date(req.created_at).toLocaleDateString()}</span>
                </div>

                <p className="font-display text-base font-semibold text-foreground">
                  {req.business_name ?? "Untitled"}
                </p>
                {req.industry ? <p className="text-xs text-muted">{req.industry}</p> : null}
                <p className="line-clamp-2 text-xs text-muted">{req.description}</p>

                {config ? (
                  <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
                    <span
                      className="h-4 w-4 rounded-full border border-white/20"
                      style={{ background: config.theme.primaryColor }}
                      title="Primary color"
                    />
                    <span
                      className="h-4 w-4 rounded-full border border-white/20"
                      style={{ background: config.theme.secondaryColor }}
                      title="Secondary color"
                    />
                    <span className="text-[11px] capitalize text-muted">{config.style}</span>
                    <span className="text-[11px] text-muted">&middot; {config.sections.length} sections</span>
                    {req.edit_count > 0 ? (
                      <span className="text-[11px] text-muted">&middot; {req.edit_count} edit{req.edit_count === 1 ? "" : "s"}</span>
                    ) : null}
                  </div>
                ) : null}

                {req.status === "failed" && req.error_message ? (
                  <p className="line-clamp-2 text-[11px] text-red-300">{req.error_message}</p>
                ) : null}

                {config ? (
                  <details className="mt-1">
                    <summary className="cursor-pointer text-[11px] text-muted hover:text-foreground">
                      View raw concept JSON
                    </summary>
                    <pre className="mt-2 max-h-48 overflow-auto rounded-lg border border-border bg-black/40 p-3 text-[10px] leading-relaxed text-foreground/80">
                      {JSON.stringify(config, null, 2)}
                    </pre>
                  </details>
                ) : null}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
