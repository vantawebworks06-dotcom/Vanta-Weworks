"use client";

import { useState } from "react";
import { VisualizerForm, type VisualizerFormValues } from "@/components/visualizer/visualizer-form";
import { GeneratingState } from "@/components/visualizer/generating-state";
import { ConceptResult } from "@/components/visualizer/concept-result";
import { LeadCaptureForm } from "@/components/visualizer/lead-capture-form";
import { Card } from "@/components/ui/card";
import type { WebsiteConcept, Theme } from "@/lib/validations/concept";

type Stage = "form" | "generating" | "result";

export function VisualizerExperience() {
  const [stage, setStage] = useState<Stage>("form");
  const [lastValues, setLastValues] = useState<VisualizerFormValues | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showLeadForm, setShowLeadForm] = useState(false);

  // History stack for undo/redo/reset. history[0] is always the original
  // AI-generated concept; historyIndex points at the currently-shown one.
  const [history, setHistory] = useState<WebsiteConcept[]>([]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const concept = history[historyIndex] ?? null;

  function pushConcept(next: WebsiteConcept) {
    setHistory((prev) => [...prev.slice(0, historyIndex + 1), next]);
    setHistoryIndex((i) => i + 1);
  }

  async function generate(values: VisualizerFormValues) {
    setLastValues(values);
    setErrorMessage(null);
    setStage("generating");
    setShowLeadForm(false);

    try {
      const res = await fetch("/api/visualize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setErrorMessage(data?.error ?? "Something went wrong. Please try again.");
        setStage("form");
        return;
      }

      setRequestId(data.requestId);
      setHistory([data.concept]);
      setHistoryIndex(0);
      setStage("result");
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
      setStage("form");
    }
  }

  async function applyEdit(instruction: string) {
    if (!concept || !requestId) return;
    setEditSubmitting(true);
    setEditError(null);

    try {
      const res = await fetch("/api/visualize/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, instruction }),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setEditError(data?.error ?? "Couldn't apply that change. Please try again.");
        return;
      }

      pushConcept(data.concept);
    } catch {
      setEditError("Network error. Please check your connection and try again.");
    } finally {
      setEditSubmitting(false);
    }
  }

  function updateLocalConcept(next: WebsiteConcept) {
    // Manual design-control tweaks apply instantly, client-side — no AI call,
    // and they get their own undo step just like an AI edit would.
    pushConcept(next);
  }

  if (stage === "generating") {
    return <GeneratingState />;
  }

  if (stage === "result" && concept) {
    return (
      <div className="flex flex-col gap-8">
        <ConceptResult
          concept={concept}
          onChangeTheme={(theme: Theme) => updateLocalConcept({ ...concept, theme })}
          onChangeStyle={(style: string) => updateLocalConcept({ ...concept, style })}
          onEdit={applyEdit}
          editSubmitting={editSubmitting}
          editError={editError}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          onUndo={() => setHistoryIndex((i) => Math.max(0, i - 1))}
          onRedo={() => setHistoryIndex((i) => Math.min(history.length - 1, i + 1))}
          onReset={() => setHistoryIndex(0)}
          onEditIdea={() => setStage("form")}
          onBringToLife={() => setShowLeadForm(true)}
        />

        {showLeadForm ? (
          <Card className="p-7 sm:p-9">
            <h3 className="font-display text-lg font-semibold">Like What You See?</h3>
            <p className="mt-1 text-sm text-muted">
              Let&apos;s turn this concept into a real website — tell us a bit about your
              project and we&apos;ll follow up with next steps.
            </p>
            <div className="mt-6">
              <LeadCaptureForm visualizationRequestId={requestId ?? undefined} />
            </div>
          </Card>
        ) : null}
      </div>
    );
  }

  return (
    <Card className="p-7 sm:p-9">
      <VisualizerForm onSubmit={generate} initialValues={lastValues ?? undefined} errorMessage={errorMessage} />
    </Card>
  );
}
