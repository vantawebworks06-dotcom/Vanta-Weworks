import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `Terms & Conditions for ${siteConfig.name}.`,
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <div className="py-20 sm:py-28">
      <Container className="max-w-3xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight">
          Terms &amp; Conditions
        </h1>
        <p className="mt-3 text-sm text-muted">Last updated: September 2026</p>

        <div className="mt-6 rounded-xl border border-gold/30 bg-gold/10 p-5 text-sm leading-relaxed text-foreground/90">
          This page is a technical starting point and is <strong>not legal advice</strong>.
          It has not been reviewed by an attorney. Please have these terms reviewed by a
          qualified professional before relying on them, particularly the sections covering
          payment, revisions, and liability for client work.
        </div>

        <div className="mt-10 flex flex-col gap-8 text-sm leading-relaxed text-foreground/85">
          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">
              Use of this website
            </h2>
            <p className="mt-3">
              By using this website, you agree not to misuse it — including attempting to
              disrupt its operation, submitting fraudulent information through our forms, or
              using automated tools to abuse the AI Website Idea Visualizer beyond its
              intended, reasonable use.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">
              AI Website Idea Visualizer
            </h2>
            <p className="mt-3">
              The Visualizer generates an illustrative website concept — layout, color
              palette, and copy — based on your description, using a third-party AI service.
              The generated concept is illustrative only, is not a guarantee of final design
              or development output, and should not be treated as a finished deliverable.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">
              Project engagements
            </h2>
            <p className="mt-3">
              Submitting the contact form or a quote request does not create a binding
              agreement. A project begins only once both parties agree on scope, timeline,
              and pricing in a separate proposal or contract.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">
              Intellectual property
            </h2>
            <p className="mt-3">
              Website content, design systems, and code produced by {siteConfig.name} remain
              our property until full payment is received for a project, at which point
              ownership transfers as specified in the project agreement.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">
              Limitation of liability
            </h2>
            <p className="mt-3">
              This website and the tools on it (including the AI Visualizer) are provided
              &quot;as is.&quot; {siteConfig.name} is not liable for indirect or
              consequential damages arising from use of this website.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">
              Contact
            </h2>
            <p className="mt-3">
              Questions about these terms can be directed to us via our{" "}
              <a href="/contact" className="underline underline-offset-4">
                Contact page
              </a>
              .
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
