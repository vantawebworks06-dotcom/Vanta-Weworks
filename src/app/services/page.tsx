import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/lib/data/services";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Website design, development, redesign, e-commerce, landing pages, SEO, maintenance, hosting, and custom web applications from Vanta Webworks.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <div className="py-20 sm:py-28">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Badge>Services</Badge>
          <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Everything you need, end to end
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            From first design concept to ongoing maintenance, each service is built to work
            together as one cohesive process.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <Reveal key={service.slug} delay={(i % 3) * 80}>
                <Link href={`/services/${service.slug}`} className="block h-full">
                  <Card className="flex h-full flex-col gap-4 p-7 hover:-translate-y-1">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border-strong bg-white/5 text-accent-2">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h2 className="font-display text-lg font-semibold text-foreground">
                      {service.title}
                    </h2>
                    <p className="flex-1 text-sm leading-relaxed text-muted">
                      {service.shortDescription}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/80 transition-colors group-hover:text-accent-2">
                      Learn more
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </Card>
                </Link>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-16 flex flex-col items-center gap-4 rounded-2xl border border-border bg-surface/40 p-10 text-center">
          <h2 className="font-display text-2xl font-semibold">Not sure which service fits?</h2>
          <p className="max-w-md text-sm text-muted">
            Tell us about your project and we&apos;ll recommend the right approach.
          </p>
          <Button href="/contact" variant="gradient" size="md">
            Start Your Project
          </Button>
        </Reveal>
      </Container>
    </div>
  );
}
