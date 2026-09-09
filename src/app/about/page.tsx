import type { Metadata } from "next";
import { Fingerprint, Gauge, LineChart, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About",
  description:
    "Vanta Webworks is a modern web design and development studio focused on premium, high-performing websites for businesses.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    icon: Fingerprint,
    title: "Craft over templates",
    description:
      "Every project is designed and built around the specific business behind it — not a recycled theme.",
  },
  {
    icon: Gauge,
    title: "Engineering discipline",
    description:
      "Clean, modern code and performance best practices are treated as core requirements, not extras.",
  },
  {
    icon: LineChart,
    title: "Results-oriented design",
    description:
      "Every design decision is evaluated against a simple standard: does it help the business grow.",
  },
  {
    icon: ShieldCheck,
    title: "Long-term reliability",
    description:
      "We build on modern, well-supported infrastructure and stay available after launch, not just during it.",
  },
];

export default function AboutPage() {
  return (
    <div className="py-20 sm:py-28">
      <Container className="max-w-3xl">
        <Reveal className="text-center">
          <Badge>About Vanta Webworks</Badge>
          <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            A studio built around one goal: websites that perform
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            Vanta Webworks designs and develops modern, high-performing websites for
            businesses. We combine a premium design sensibility with disciplined engineering
            practices, so every project looks exceptional and works exceptionally well —
            from the first page load to the final conversion.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <p className="mt-8 text-base leading-relaxed text-foreground/85">
            We treat a website as more than a digital brochure — it&apos;s a business tool
            that should build trust, communicate value clearly, and make it easy for
            potential customers to take the next step. That belief shapes every decision we
            make, from the structure of a homepage to the way a checkout flow is laid out.
          </p>
        </Reveal>
      </Container>

      <Container className="mt-20">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {values.map((value, i) => {
            const Icon = value.icon;
            return (
              <Reveal key={value.title} delay={i * 80}>
                <Card className="flex h-full flex-col gap-4 p-7">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-strong bg-white/5 text-gold">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h2 className="font-display text-base font-semibold">{value.title}</h2>
                  <p className="text-sm leading-relaxed text-muted">{value.description}</p>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </Container>

      <Container className="mt-20 max-w-2xl text-center">
        <Reveal className="flex flex-col items-center gap-4 rounded-2xl border border-border-strong bg-surface p-10">
          <h2 className="font-display text-2xl font-semibold">
            Let&apos;s build something worth showing off
          </h2>
          <p className="text-sm text-muted">
            Tell us about your business and what you&apos;re trying to achieve online.
          </p>
          <Button href="/contact" variant="gradient" size="md">
            Start Your Project
          </Button>
        </Reveal>
      </Container>
    </div>
  );
}
