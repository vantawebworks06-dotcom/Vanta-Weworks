import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getProjects } from "@/lib/data/projects";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { ProjectPreview } from "@/components/ui/project-preview";
import { ExampleBadge } from "@/components/ui/example-badge";

export async function FeaturedProjects() {
  const projects = (await getProjects()).slice(0, 3);

  if (projects.length === 0) return null;

  return (
    <section id="portfolio" className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Portfolio"
          title="Recent work"
          description="A look at how we approach design and development across different industries."
        />

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {projects.map((project, i) => (
            <Reveal key={project.id} delay={i * 100}>
              <Link href={`/portfolio/${project.slug}`} className="group block h-full">
                <ProjectPreview
                  seed={project.slug}
                  label={project.industry ?? project.title}
                  coverImagePath={project.cover_image_path}
                />
                <div className="mt-5 flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-lg font-semibold text-foreground">
                        {project.title}
                      </h3>
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

        <Reveal className="mt-12 flex justify-center">
          <Button href="/portfolio" variant="outline" size="md">
            View full portfolio
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
