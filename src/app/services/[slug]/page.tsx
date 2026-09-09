import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check, ArrowRight } from "lucide-react";
import { services, getServiceBySlug } from "@/lib/data/services";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  return {
    title: service.title,
    description: service.description,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: { title: service.title, description: service.description },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const Icon = service.icon;

  return (
    <div className="py-20 sm:py-28">
      <Container className="max-w-3xl">
        <Reveal>
          <Badge>Services</Badge>
          <div className="mt-6 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border-strong bg-white/5 text-accent-2">
              <Icon className="h-6 w-6" aria-hidden="true" />
            </div>
            <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {service.title}
            </h1>
          </div>
          <p className="mt-6 text-lg leading-relaxed text-muted">{service.description}</p>
        </Reveal>

        <Reveal delay={100} className="mt-10 rounded-2xl border border-border bg-surface/40 p-7">
          <h2 className="font-display text-base font-semibold text-foreground">Best for</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{service.bestFor}</p>
        </Reveal>

        <Reveal delay={160} className="mt-10">
          <h2 className="font-display text-xl font-semibold">What you get</h2>
          <ul className="mt-5 flex flex-col gap-3">
            {service.deliverables.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-foreground/90">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-2" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={220} className="mt-14 flex flex-col items-start gap-4 rounded-2xl border border-border-strong bg-surface p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold">Ready to get started?</h2>
            <p className="mt-1 text-sm text-muted">Tell us about your project and we&apos;ll follow up.</p>
          </div>
          <Button href={`/contact?service=${service.slug}`} variant="gradient" size="md">
            Start Your Project
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </Reveal>
      </Container>
    </div>
  );
}
