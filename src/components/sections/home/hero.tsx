import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { HeroWebsiteDemo } from "@/components/sections/home/hero-website-demo";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-24 sm:pt-28 sm:pb-32">
      <div
        className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px]"
        style={{ background: "var(--gradient-radial-glow)" }}
        aria-hidden="true"
      />

      <Container className="relative">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <Reveal>
            <Badge className="normal-case tracking-normal">
              <Sparkles className="h-3.5 w-3.5 text-accent-2" aria-hidden="true" />
              Modern web design &amp; development studio
            </Badge>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-8 text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
              Websites Built to Make Your
              <span className="text-gradient-brand"> Business Stand Out.</span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-muted sm:text-xl">
              Vanta Webworks designs and develops modern, high-performing websites for
              businesses — combining premium design, clean engineering, and
              conversion-focused strategy in every project.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
              <Button href="/contact" variant="gradient" size="lg">
                Start Your Project
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button href="/portfolio" variant="outline" size="lg">
                Explore Our Work
              </Button>
            </div>
          </Reveal>
        </div>

        <Reveal delay={320} className="mt-24 sm:mt-28">
          <div className="relative mx-auto max-w-5xl">
            <div
              className="pointer-events-none absolute -inset-x-10 -top-10 -bottom-10 -z-10 opacity-40 blur-3xl"
              style={{ background: "var(--gradient-brand)" }}
              aria-hidden="true"
            />
            <HeroWebsiteDemo />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
