import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getProjects } from "@/lib/data/projects";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { ProjectPreview } from "@/components/ui/project-preview";
import { ExampleBadge } from "@/components/ui/example-badge";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Explore website design and development projects by Vanta Webworks across e-commerce, logistics, professional services, and more.",
  alternates: { canonical: "/portfolio" },
};

export default async function PortfolioPage() {
  const projects = await getProjects();

  return (
    <div className="py-20 sm:py-28">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Badge>Portfolio</Badge>
          <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Work we&apos;re proud of
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            A look at how we approach design and development across different industries.
          </p>
        </div>

        {projects.length === 0 ? (
          <Reveal className="mt-16 rounded-2xl border border-border bg-surface/40 p-16 text-center text-muted">
            New case studies are on the way. Check back soon.
          </Reveal>
        ) : (
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <Reveal key={project.id} delay={(i % 3) * 100}>
                <Link href={`/portfolio/${project.slug}`} className="group block h-full">
                  <ProjectPreview seed={project.slug} label={project.industry ?? project.title} />
                  <div className="mt-5 flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-display text-lg font-semibold text-foreground">
                          {project.title}
                        </h2>
                        {project.is_placeholder ? <ExampleBadge /> : null}
                      </div>
                      {project.industry ? (
                        <p className="mt-1 text-sm text-muted">{project.industry}</p>
                      ) : null}
                    </div>
                    <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-2" />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
