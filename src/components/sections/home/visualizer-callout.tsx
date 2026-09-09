import { Wand2, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export function VisualizerCallout() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border-strong bg-surface p-10 sm:p-16">
            <div
              className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full opacity-30 blur-3xl"
              style={{ background: "var(--gradient-brand)" }}
              aria-hidden="true"
            />
            <div className="relative mx-auto flex max-w-2xl flex-col items-center text-center">
              <Badge>
                <Wand2 className="h-3.5 w-3.5 text-accent-2" aria-hidden="true" />
                Signature Feature
              </Badge>
              <h2 className="mt-6 text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Imagine Your Website Before We Build It.
              </h2>
              <p className="mt-4 text-balance text-base leading-relaxed text-muted sm:text-lg">
                Describe the website you have in mind and our AI Website Idea Visualizer
                will generate a visual concept in seconds — a fast, free way to see your
                idea take shape before any commitment.
              </p>
              <Button href="/visualizer" variant="gradient" size="lg" className="mt-8">
                Try the AI Visualizer
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
