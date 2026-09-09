import type { Metadata } from "next";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

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
    .select("id, description, industry, style, status, error_message, created_at, generated_concepts(image_path)")
    .order("created_at", { ascending: false })
    .limit(60);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">AI Visualizer Requests</h1>
        <p className="mt-1 text-sm text-muted">
          Every concept generated through the public /visualizer tool, most recent first.
        </p>
      </div>

      {!requests || requests.length === 0 ? (
        <Card className="p-10 text-center text-sm text-muted">No visualizations yet.</Card>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {requests.map((req) => {
            const imagePath = req.generated_concepts?.[0]?.image_path;
            const publicUrl = imagePath
              ? supabase.storage.from("concepts").getPublicUrl(imagePath).data.publicUrl
              : null;

            return (
              <Card key={req.id} className="flex flex-col gap-3 overflow-hidden p-0">
                <div className="relative aspect-video w-full bg-black/40">
                  {publicUrl ? (
                    <Image src={publicUrl} alt="" fill className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted">
                      No image
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 p-4">
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide",
                        statusStyles[req.status] ?? statusStyles.pending
                      )}
                    >
                      {req.status}
                    </span>
                    <span className="text-[11px] text-muted">
                      {new Date(req.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {req.industry ? <p className="text-xs font-medium text-foreground">{req.industry}</p> : null}
                  <p className="line-clamp-3 text-xs text-muted">{req.description}</p>
                  {req.status === "failed" && req.error_message ? (
                    <p className="line-clamp-2 text-[11px] text-red-300">{req.error_message}</p>
                  ) : null}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
