import { Check } from "lucide-react";
import { pricingTiers } from "@/lib/data/pricing";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export function PricingOverview() {
  return (
    <section id="pricing" className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Pricing"
          title="Straightforward packages, built to scale with you"
          description="Every project starts with a conversation — these packages give you a clear starting point."
        />

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {pricingTiers.map((tier, i) => (
            <Reveal key={tier.slug} delay={i * 100}>
              <Card
                className={cn(
                  "flex h-full flex-col gap-6 p-8",
                  tier.featured && "border-accent/50 bg-surface shadow-[0_0_0_1px_rgba(124,92,255,0.3)]"
                )}
              >
                {tier.featured ? (
                  <span className="w-fit rounded-full bg-[linear-gradient(135deg,#7c5cff,#22d3ee)] px-3 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                ) : null}
                <div>
                  <h3 className="font-display text-xl font-semibold">{tier.name}</h3>
                  <p className="mt-2 text-sm text-muted">{tier.description}</p>
                </div>
                <div>
                  <span className="font-display text-4xl font-semibold">{tier.price}</span>
                  <span className="ml-2 text-sm text-muted">{tier.cadence}</span>
                </div>
                <ul className="flex flex-1 flex-col gap-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-foreground/85">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-2" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
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

        <Reveal className="mt-10 text-center">
          <p className="text-sm text-muted">
            Need something more specific?{" "}
            <a href="/contact" className="font-medium text-foreground underline underline-offset-4">
              Request a custom quote
            </a>
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
