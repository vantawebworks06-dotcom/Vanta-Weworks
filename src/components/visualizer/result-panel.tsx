"use client";

import Image from "next/image";
import { RefreshCw, PencilLine, Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ResultPanel({
  imageUrl,
  promptUsed,
  onRegenerate,
  onEdit,
  onBringToLife,
  regenerating,
}: {
  imageUrl: string;
  promptUsed: string;
  onRegenerate: () => void;
  onEdit: () => void;
  onBringToLife: () => void;
  regenerating: boolean;
}) {
  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <div className="relative aspect-[3/2] w-full bg-black/40">
          <Image
            src={imageUrl}
            alt="AI-generated website concept preview"
            fill
            className="object-cover"
          />
        </div>
      </Card>

      <details className="rounded-xl border border-border bg-surface/40 p-4 text-sm text-muted">
        <summary className="cursor-pointer font-medium text-foreground/85">Prompt used</summary>
        <p className="mt-2 leading-relaxed">{promptUsed}</p>
      </details>

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" size="md" onClick={onRegenerate} disabled={regenerating}>
          <RefreshCw className={`h-4 w-4 ${regenerating ? "animate-spin" : ""}`} aria-hidden="true" />
          Regenerate
        </Button>
        <Button variant="outline" size="md" onClick={onEdit}>
          <PencilLine className="h-4 w-4" aria-hidden="true" />
          Edit Idea
        </Button>
        <Button variant="outline" size="md" href={imageUrl} download="vanta-webworks-concept.png">
          <Download className="h-4 w-4" aria-hidden="true" />
          Download
        </Button>
      </div>

      <div className="rounded-2xl border border-border-strong bg-surface p-6 sm:p-8">
        <h3 className="font-display text-lg font-semibold">Like this direction?</h3>
        <p className="mt-1 text-sm text-muted">
          Let&apos;s turn this concept into a real, fully-built website for your business.
        </p>
        <Button variant="gradient" size="md" className="mt-5" onClick={onBringToLife}>
          Bring This Idea to Life
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
