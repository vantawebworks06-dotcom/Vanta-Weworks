import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, ExternalLink } from "lucide-react";
import { getProjectBySlug } from "@/lib/data/projects";
import { getServiceBySlug } from "@/lib/data/services";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { ProjectPreview } from "@/components/ui/project-preview";
import { ExampleBadge } from "@/components/ui/example-badge";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary ?? undefined,
    alternates: { canonical: `/portfolio/${project.slug}` },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <div className="py-20 sm:py-28">
      <Container className="max-w-4xl">
        <Reveal>
          <div className="flex flex-wrap items-center gap-3">
            <Badge>{project.industry ?? "Case Study"}</Badge>
            {project.is_placeholder ? <ExampleBadge /> : null}
          </div>
          <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {project.title}
          </h1>
          {project.summary ? (
            <p className="mt-4 text-lg leading-relaxed text-muted">{project.summary}</p>
          ) : null}
        </Reveal>

        <Reveal delay={80} className="mt-10">
          <ProjectPreview
            seed={project.slug}
            label={project.industry ?? project.title}
            coverImagePath={project.cover_image_path}
            className="w-full"
          />
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
          <Reveal delay={140}>
            {project.content ? (
              <p className="text-base leading-relaxed text-foreground/90">{project.content}</p>
            ) : null}
            {project.results ? (
              <div className="mt-8 rounded-xl border border-border bg-surface/40 p-6">
                <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-gold">
                  Results
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-foreground/90">{project.results}</p>
              </div>
            ) : null}
          </Reveal>

          <Reveal delay={200} className="flex flex-col gap-6">
            {project.client_name ? (
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">Client</h2>
                <p className="mt-1 text-sm text-foreground">{project.client_name}</p>
              </div>
            ) : null}

            {project.services_provided.length > 0 ? (
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Services provided
                </h2>
                <ul className="mt-2 flex flex-col gap-1.5">
                  {project.services_provided.map((slugName) => {
                    const service = getServiceBySlug(slugName);
                    return (
                      <li key={slugName} className="text-sm text-foreground">
                        {service?.title ?? slugName}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}

            {project.technologies.length > 0 ? (
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Technology used
                </h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-border bg-white/5 px-3 py-1 text-xs text-foreground/85"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {project.project_url ? (
              <a
                href={project.project_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-2 hover:underline"
              >
                View live project
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            ) : null}
          </Reveal>
        </div>

        <Reveal delay={260} className="mt-16 flex flex-col items-start gap-4 rounded-2xl border border-border-strong bg-surface p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold">Want a project like this?</h2>
            <p className="mt-1 text-sm text-muted">Let&apos;s talk about what you have in mind.</p>
          </div>
          <Button href="/contact" variant="gradient" size="md">
            Start Your Project
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </Reveal>
      </Container>
    </div>
  );
}
