import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export function FinalCta() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <Reveal className="relative overflow-hidden rounded-3xl p-12 text-center sm:p-20">
          <div
            className="absolute inset-0 -z-10"
            style={{ background: "var(--gradient-brand)" }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 -z-10 bg-black/25" aria-hidden="true" />
          <h2 className="mx-auto max-w-2xl text-balance font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Ready for a website that actually works for your business?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-balance text-base text-white/85 sm:text-lg">
            Tell us about your project and we&apos;ll get back to you with next steps.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href="/contact" size="lg" className="bg-white text-black hover:bg-white/90">
              Start Your Project
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              href="/visualizer"
              variant="outline"
              size="lg"
              className="border-white/40 text-white hover:bg-white/10"
            >
              Try the AI Visualizer
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
