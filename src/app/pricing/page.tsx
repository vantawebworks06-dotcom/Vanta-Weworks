import type { Metadata } from "next";
import { Check } from "lucide-react";
import { pricingTiers } from "@/lib/data/pricing";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { Faq } from "@/components/sections/home/faq";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Transparent starting packages for website design and development from Vanta Webworks, with custom quotes available for larger projects.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <div className="py-20 sm:py-28">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Badge>Pricing</Badge>
          <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Straightforward packages, built to scale
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Every project starts with a conversation about your goals — these packages give
            you a clear starting point for scope and investment.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {pricingTiers.map((tier, i) => (
            <Reveal key={tier.slug} delay={i * 100}>
              <Card
                className={cn(
                  "flex h-full flex-col gap-6 p-8",
                  tier.featured &&
                    "border-accent/50 bg-surface shadow-[0_0_0_1px_rgba(124,92,255,0.3)]"
                )}
              >
                {tier.featured ? (
                  <span className="w-fit rounded-full bg-[linear-gradient(135deg,#7c5cff,#22d3ee)] px-3 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                ) : null}
                <div>
                  <h2 className="font-display text-xl font-semibold">{tier.name}</h2>
                  <p className="mt-2 text-sm text-muted">{tier.description}</p>
                </div>
                <div>
                  <span className="font-display text-4xl font-semibold">{tier.price}</span>
                  <span className="ml-2 text-sm text-muted">{tier.cadence}</span>
                </div>
                <ul className="flex flex-1 flex-col gap-3">
                  {tier.features.map((feature) =>
                    feature.endsWith(":") ? (
                      <li key={feature} className="pt-1 text-xs font-medium uppercase tracking-wide text-muted">
                        {feature}
                      </li>
                    ) : (
                      <li key={feature} className="flex items-start gap-2.5 text-sm text-foreground/85">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-2" aria-hidden="true" />
                        {feature}
                      </li>
                    )
                  )}
                </ul>
                <p className="text-xs text-muted">
                  Maintenance: <span className="text-foreground/80">{tier.maintenance}</span>
                </p>
                <Button
                  href="/contact"
                  variant={tier.featured ? "gradient" : "outline"}
                  size="md"
                  className="w-full"
                >
                  {tier.cta}
                </Button>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16 flex flex-col items-center gap-4 rounded-2xl border border-border bg-surface/40 p-10 text-center">
          <h2 className="font-display text-2xl font-semibold">Have a bigger scope in mind?</h2>
          <p className="max-w-md text-sm text-muted">
            E-commerce platforms, custom applications, and multi-phase projects are quoted
            individually based on scope.
          </p>
          <Button href="/contact?service=custom-web-applications" variant="gradient" size="md">
            Request a Custom Quote
          </Button>
        </Reveal>
      </Container>

      <Faq />
    </div>
  );
}
