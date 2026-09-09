import { Reveal } from "@/components/ui/reveal";
import { Container } from "@/components/ui/container";

const stats = [
  { value: "2–4 wks", label: "Typical launch timeline" },
  { value: "100%", label: "Mobile-responsive builds" },
  { value: "7-step", label: "Structured project process" },
  { value: "30 days", label: "Post-launch support included" },
];

export function TrustBar() {
  return (
    <section className="border-y border-border bg-surface/30 py-12">
      <Container>
        <Reveal>
          <p className="text-center text-xs font-medium uppercase tracking-widest text-muted">
            Built on a process designed for reliable, on-time delivery
          </p>
        </Reveal>
        <div className="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 60} className="text-center">
              <p className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
