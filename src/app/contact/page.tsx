import type { Metadata } from "next";
import { Suspense } from "react";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { ContactForm } from "@/components/forms/contact-form";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell us about your project and get a response from the Vanta Webworks team — website design, development, and custom web applications.",
  alternates: { canonical: "/contact" },
};

const contactMethods = [
  {
    icon: Mail,
    label: "Email",
    value: siteConfig.contact.email,
    href: siteConfig.contact.email ? `mailto:${siteConfig.contact.email}` : undefined,
  },
  {
    icon: Phone,
    label: "Phone",
    value: siteConfig.contact.phone,
    href: siteConfig.contact.phone ? `tel:${siteConfig.contact.phone}` : undefined,
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: siteConfig.contact.whatsapp,
    href: siteConfig.contact.whatsapp
      ? `https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, "")}`
      : undefined,
  },
  {
    icon: MapPin,
    label: "Service area",
    value: siteConfig.contact.serviceArea,
    href: undefined,
  },
].filter((method) => method.value);

export default function ContactPage() {
  return (
    <div className="py-20 sm:py-28">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Badge>Contact</Badge>
          <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Let&apos;s talk about your project
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Share a few details and we&apos;ll follow up with next steps — whether that&apos;s a
            quick question or a full project brief.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="flex flex-col gap-6">
            {contactMethods.length > 0 ? (
              <Card className="flex flex-col gap-5 p-7">
                <h2 className="font-display text-lg font-semibold">Other ways to reach us</h2>
                <ul className="flex flex-col gap-4">
                  {contactMethods.map((method) => {
                    const Icon = method.icon;
                    const content = (
                      <span className="flex items-start gap-3">
                        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-accent-2" aria-hidden="true" />
                        <span>
                          <span className="block text-xs uppercase tracking-wide text-muted">
                            {method.label}
                          </span>
                          <span className="text-sm text-foreground">{method.value}</span>
                        </span>
                      </span>
                    );
                    return (
                      <li key={method.label}>
                        {method.href ? (
                          <a
                            href={method.href}
                            target={method.label === "WhatsApp" ? "_blank" : undefined}
                            rel={method.label === "WhatsApp" ? "noopener noreferrer" : undefined}
                            className="transition-colors hover:text-accent-2"
                          >
                            {content}
                          </a>
                        ) : (
                          content
                        )}
                      </li>
                    );
                  })}
                </ul>
              </Card>
            ) : null}

            <Card className="flex flex-col gap-3 p-7">
              <h2 className="font-display text-lg font-semibold">What happens next?</h2>
              <ol className="flex flex-col gap-3 text-sm leading-relaxed text-muted">
                <li>1. We review your project details within one business day.</li>
                <li>2. We follow up by email (or phone, if provided) to clarify scope.</li>
                <li>3. You receive a clear proposal with timeline and pricing.</li>
              </ol>
            </Card>
          </div>

          <Card className="p-7 sm:p-9">
            <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-white/5" />}>
              <ContactForm />
            </Suspense>
          </Card>
        </div>
      </Container>
    </div>
  );
}
