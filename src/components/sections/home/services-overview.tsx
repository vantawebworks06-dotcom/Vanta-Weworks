import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/lib/data/services";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

export function ServicesOverview() {
  const featured = services.slice(0, 6);

  return (
    <section id="services" className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Services"
          title="Everything your business needs to win online"
          description="From first-time launches to full platform rebuilds, we cover the complete surface of modern web presence."
        />

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((service, i) => {
            const Icon = service.icon;
            return (
              <Reveal key={service.slug} delay={(i % 3) * 80}>
                <Link href={`/services/${service.slug}`} className="block h-full">
                  <Card className="flex h-full flex-col gap-4 p-7 hover:-translate-y-1">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border-strong bg-white/5 text-accent-2">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {service.title}
                    </h3>
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

        <Reveal className="mt-12 flex justify-center">
          <Button href="/services" variant="outline" size="md">
            View all services
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
