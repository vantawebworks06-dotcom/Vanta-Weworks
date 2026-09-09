import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { siteConfig, footerNav, mainNav } from "@/lib/site-config";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/layout/logo";
import {
  XIcon,
  InstagramIcon,
  LinkedInIcon,
  GitHubIcon,
  FacebookIcon,
} from "@/components/icons/social-icons";

const socialIcons = {
  twitter: XIcon,
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
  github: GitHubIcon,
  facebook: FacebookIcon,
} as const;

export function Footer() {
  const year = new Date().getFullYear();
  const socialEntries = Object.entries(siteConfig.social).filter(([, url]) => url);

  return (
    <footer className="border-t border-border bg-surface/40">
      <Container className="grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-5">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-muted">
            {siteConfig.description}
          </p>
          {socialEntries.length > 0 ? (
            <div className="mt-2 flex items-center gap-3">
              {socialEntries.map(([key, url]) => {
                const Icon = socialIcons[key as keyof typeof socialIcons];
                if (!Icon || !url) return null;
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Vanta Webworks on ${key}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-border-strong hover:text-foreground"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          ) : null}
        </div>

        <nav aria-label="Company">
          <h3 className="text-sm font-semibold text-foreground">Company</h3>
          <ul className="mt-4 flex flex-col gap-3">
            {footerNav.company.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Services">
          <h3 className="text-sm font-semibold text-foreground">Services</h3>
          <ul className="mt-4 flex flex-col gap-3">
            {mainNav
              .filter((item) => item.href === "/services")
              .map(() => (
                <li key="services">
                  <Link
                    href="/services"
                    className="text-sm text-muted transition-colors hover:text-foreground"
                  >
                    All Services
                  </Link>
                </li>
              ))}
            <li>
              <Link href="/visualizer" className="text-sm text-muted transition-colors hover:text-foreground">
                AI Website Visualizer
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="text-sm text-muted transition-colors hover:text-foreground">
                Pricing
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h3 className="text-sm font-semibold text-foreground">Contact</h3>
          <ul className="mt-4 flex flex-col gap-3">
            {siteConfig.contact.email ? (
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
                >
                  <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {siteConfig.contact.email}
                </a>
              </li>
            ) : null}
            {siteConfig.contact.phone ? (
              <li>
                <a
                  href={`tel:${siteConfig.contact.phone}`}
                  className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
                >
                  <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {siteConfig.contact.phone}
                </a>
              </li>
            ) : null}
            {siteConfig.contact.serviceArea ? (
              <li className="flex items-start gap-2 text-sm text-muted">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                {siteConfig.contact.serviceArea}
              </li>
            ) : null}
            <li>
              <Link href="/contact" className="text-sm text-muted transition-colors hover:text-foreground">
                Contact form &rarr;
              </Link>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-border">
        <Container className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-xs text-muted">
            &copy; {year} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {footerNav.legal.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs text-muted transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </Container>
      </div>
    </footer>
  );
}
