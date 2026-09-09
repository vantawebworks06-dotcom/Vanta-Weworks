import { getTestimonials } from "@/lib/data/testimonials";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { StarRating } from "@/components/ui/star-rating";
import { ExampleBadge } from "@/components/ui/example-badge";

export async function Testimonials() {
  const testimonials = await getTestimonials();

  if (testimonials.length === 0) return null;

  return (
    <section className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Testimonials"
          title="What clients say about working with us"
        />

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.id} delay={i * 80}>
              <Card className="flex h-full flex-col gap-5 p-7">
                <div className="flex items-center justify-between">
                  <StarRating rating={t.rating} />
                  {t.is_placeholder ? <ExampleBadge /> : null}
                </div>
                <p className="flex-1 text-sm leading-relaxed text-foreground/90">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 border-t border-border pt-5">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-sm font-semibold text-white"
                    style={{ background: "var(--gradient-brand)" }}
                    aria-hidden="true"
                  >
                    {t.client_name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{t.client_name}</p>
                    <p className="text-xs text-muted">
                      {[t.client_title, t.company].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
