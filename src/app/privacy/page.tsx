import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy Policy for ${siteConfig.name}.`,
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="py-20 sm:py-28">
      <Container className="max-w-3xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight">Privacy Policy</h1>
        <p className="mt-3 text-sm text-muted">Last updated: September 2026</p>

        <div className="mt-6 rounded-xl border border-gold/30 bg-gold/10 p-5 text-sm leading-relaxed text-foreground/90">
          This page is a technical starting point describing what this website actually
          collects and how. It is <strong>not legal advice</strong> and has not been reviewed
          by an attorney. Please have this policy reviewed by a qualified professional before
          relying on it for legal compliance (e.g. GDPR, CCPA, or other applicable
          regulations for your jurisdiction and business).
        </div>

        <div className="prose-content mt-10 flex flex-col gap-8 text-sm leading-relaxed text-foreground/85">
          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">
              Information we collect
            </h2>
            <p className="mt-3">
              When you submit our contact form, we collect the information you provide:
              name, email address, phone number (optional), company name (optional), website
              URL (optional), service interest, budget range, timeline, and your project
              description. When you use the AI Website Idea Visualizer, we collect the
              description and preferences you enter, and, if you choose to submit your
              contact details afterward, the same information as the contact form.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">
              How we use your information
            </h2>
            <p className="mt-3">
              We use the information you submit to respond to your inquiry, prepare project
              proposals, and, where applicable, deliver the services you request. We do not
              sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">
              Data storage
            </h2>
            <p className="mt-3">
              Form submissions and visualizer requests are stored in our database (provided
              by Supabase) with access restricted to authorized administrators through
              row-level security. Data is retained for as long as reasonably necessary to
              respond to your inquiry and maintain business records.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">
              Third-party services
            </h2>
            <p className="mt-3">
              We may use third-party services to operate this website, including hosting
              (Vercel), database and authentication (Supabase), transactional email
              delivery, and AI image generation for the Website Idea Visualizer. These
              providers process data only as necessary to provide their service to us.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">
              Your rights
            </h2>
            <p className="mt-3">
              You may request access to, correction of, or deletion of your personal
              information by contacting us using the details on our{" "}
              <a href="/contact" className="underline underline-offset-4">
                Contact page
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">
              Changes to this policy
            </h2>
            <p className="mt-3">
              We may update this policy as our services change. Material changes will be
              reflected by updating the &quot;Last updated&quot; date above.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
