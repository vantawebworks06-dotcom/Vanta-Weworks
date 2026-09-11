"use client";

import { useState } from "react";
import { ArrowRight, PencilLine, Sparkles } from "lucide-react";
import type { WebsiteConcept } from "@/lib/validations/concept";
import { PreviewFrame } from "@/components/visualizer/preview/preview-frame";
import { DeviceSwitcher, type Device } from "@/components/visualizer/device-switcher";
import { DesignControls } from "@/components/visualizer/design-controls";
import { EditBar } from "@/components/visualizer/edit-bar";
import { DebugPanel } from "@/components/visualizer/debug-panel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ConceptResult({
  concept,
  onChangeTheme,
  onChangeStyle,
  onEdit,
  editSubmitting,
  editError,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onReset,
  onEditIdea,
  onBringToLife,
}: {
  concept: WebsiteConcept;
  onChangeTheme: (theme: WebsiteConcept["theme"]) => void;
  onChangeStyle: (style: string) => void;
  onEdit: (instruction: string) => void;
  editSubmitting: boolean;
  editError?: string | null;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  onEditIdea: () => void;
  onBringToLife: () => void;
}) {
  const [device, setDevice] = useState<Device>("desktop");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start gap-3 rounded-xl border border-border bg-surface/40 p-4 text-sm text-muted">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent-2" aria-hidden="true" />
        <p>
          <span className="font-medium text-foreground">AI Preview</span> — this is a visual
          concept, not the final website. Your finished website will be customized and refined
          based on your business, branding, content, features, and requirements.
        </p>
      </div>

      <DebugPanel concept={concept} />

      <Card className="overflow-hidden p-0">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <DesignControls theme={concept.theme} style={concept.style} onThemeChange={onChangeTheme} onStyleChange={onChangeStyle} />
          <DeviceSwitcher value={device} onChange={setDevice} />
        </div>

        <PreviewFrame concept={concept} device={device} />

        <EditBar
          onSubmit={onEdit}
          submitting={editSubmitting}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={onUndo}
          onRedo={onRedo}
          onReset={onReset}
          errorMessage={editError}
        />
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" size="md" onClick={onEditIdea}>
          <PencilLine className="h-4 w-4" aria-hidden="true" />
          Edit Idea From Scratch
        </Button>
      </div>

      <div className="rounded-2xl border border-border-strong bg-surface p-6 sm:p-8">
        <h3 className="font-display text-lg font-semibold">Ready to make it real?</h3>
        <p className="mt-1 text-sm text-muted">
          Your concept is only the beginning. Vanta Webworks can turn it into a fully
          functional website.
        </p>
        <Button variant="gradient" size="md" className="mt-5" onClick={onBringToLife}>
          Start My Project
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
