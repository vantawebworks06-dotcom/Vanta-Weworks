import { processSteps } from "@/lib/data/process";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

export function Process() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Our Process"
          title="A clear, structured path from idea to launch"
          description="No guesswork, no scope creep — every project follows the same disciplined process."
        />

        <ol className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal as="li" key={item.step} delay={(i % 4) * 80} className="bg-surface p-7">
                <div className="flex items-center justify-between">
                  <span className="font-display text-3xl font-semibold text-white/10">
                    {item.step}
                  </span>
                  <Icon className="h-5 w-5 text-accent-2" aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-display text-base font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
              </Reveal>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
