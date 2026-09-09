import { getFaqItems } from "@/lib/data/faq";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Accordion } from "@/components/ui/accordion";

export async function Faq() {
  const items = await getFaqItems();

  if (items.length === 0) return null;

  return (
    <section className="py-24 sm:py-32">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow="FAQ" title="Frequently asked questions" />
        <Reveal className="mt-14">
          <Accordion items={items} />
        </Reveal>
      </Container>
    </section>
  );
}
