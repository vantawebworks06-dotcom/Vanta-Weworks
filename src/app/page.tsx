import type { Metadata } from "next";
import { Hero } from "@/components/sections/home/hero";
import { TrustBar } from "@/components/sections/home/trust-bar";
import { ServicesOverview } from "@/components/sections/home/services-overview";
import { WhyUs } from "@/components/sections/home/why-us";
import { FeaturedProjects } from "@/components/sections/home/featured-projects";
import { Process } from "@/components/sections/home/process";
import { VisualizerCallout } from "@/components/sections/home/visualizer-callout";
import { Testimonials } from "@/components/sections/home/testimonials";
import { PricingOverview } from "@/components/sections/home/pricing-overview";
import { Faq } from "@/components/sections/home/faq";
import { FinalCta } from "@/components/sections/home/final-cta";

export const revalidate = 60;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <ServicesOverview />
      <WhyUs />
      <FeaturedProjects />
      <Process />
      <VisualizerCallout />
      <Testimonials />
      <PricingOverview />
      <Faq />
      <FinalCta />
    </>
  );
}
