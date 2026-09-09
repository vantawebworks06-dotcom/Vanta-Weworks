"use client";

import { useState } from "react";
import { VisualizerForm, type VisualizerFormValues } from "@/components/visualizer/visualizer-form";
import { GeneratingState } from "@/components/visualizer/generating-state";
import { ResultPanel } from "@/components/visualizer/result-panel";
import { LeadCaptureForm } from "@/components/visualizer/lead-capture-form";
import { Card } from "@/components/ui/card";

type Stage = "form" | "generating" | "result";

type Result = {
  imageUrl: string;
  promptUsed: string;
  requestId: string;
};

export function VisualizerExperience() {
  const [stage, setStage] = useState<Stage>("form");
  const [lastValues, setLastValues] = useState<VisualizerFormValues | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showLeadForm, setShowLeadForm] = useState(false);

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

      setResult({ imageUrl: data.imageUrl, promptUsed: data.promptUsed, requestId: data.requestId });
      setStage("result");
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
      setStage("form");
    }
  }

  if (stage === "generating") {
    return <GeneratingState />;
  }

  if (stage === "result" && result) {
    return (
      <div className="flex flex-col gap-8">
        <ResultPanel
          imageUrl={result.imageUrl}
          promptUsed={result.promptUsed}
          regenerating={false}
          onRegenerate={() => lastValues && generate(lastValues)}
          onEdit={() => setStage("form")}
          onBringToLife={() => setShowLeadForm(true)}
        />

        {showLeadForm ? (
          <Card className="p-7 sm:p-9">
            <h3 className="font-display text-lg font-semibold">Tell us about your project</h3>
            <p className="mt-1 text-sm text-muted">
              We&apos;ll follow up with next steps to bring this concept to life.
            </p>
            <div className="mt-6">
              <LeadCaptureForm visualizationRequestId={result.requestId} />
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
