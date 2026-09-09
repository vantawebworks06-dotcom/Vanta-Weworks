import { Gauge, Fingerprint, ShieldCheck, LineChart } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";

const reasons = [
  {
    icon: Fingerprint,
    title: "Custom, not templated",
    description:
      "Every site is designed from scratch around your brand — no recycled themes or cookie-cutter layouts.",
  },
  {
    icon: Gauge,
    title: "Built for performance",
    description:
      "Fast load times and strong Core Web Vitals aren't an afterthought — they're engineered in from day one.",
  },
  {
    icon: LineChart,
    title: "Conversion-focused",
    description:
      "Every layout decision is made with one question in mind: does this help turn visitors into customers?",
  },
  {
    icon: ShieldCheck,
    title: "Reliable & maintained",
    description:
      "Modern infrastructure, secure practices, and ongoing support so your site keeps working long after launch.",
  },
];

export function WhyUs() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          <SectionHeading
            align="left"
            eyebrow="Why Vanta Webworks"
            title="A studio-level process, without the studio overhead"
            description="We combine premium design sensibility with disciplined engineering practices — so you get a website that looks exceptional and performs even better."
            className="lg:sticky lg:top-28"
          />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {reasons.map((reason, i) => {
              const Icon = reason.icon;
              return (
                <Reveal key={reason.title} delay={i * 80}>
                  <Card className="flex h-full flex-col gap-4 p-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-strong bg-white/5 text-gold">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="font-display text-base font-semibold">{reason.title}</h3>
                    <p className="text-sm leading-relaxed text-muted">{reason.description}</p>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
