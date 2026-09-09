import type { Metadata } from "next";
import { Wand2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { VisualizerExperience } from "@/components/visualizer/visualizer-experience";

export const metadata: Metadata = {
  title: "AI Website Idea Visualizer",
  description:
    "Describe the website you have in mind and get an AI-generated visual concept in seconds — a signature Vanta Webworks tool.",
  alternates: { canonical: "/visualizer" },
};

export default function VisualizerPage() {
  return (
    <div className="py-20 sm:py-28">
      <Container className="max-w-3xl text-center">
        <Badge>
          <Wand2 className="h-3.5 w-3.5 text-accent-2" aria-hidden="true" />
          AI Website Idea Visualizer
        </Badge>
        <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Imagine Your Website Before We Build It.
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          Describe your vision and our AI will generate a visual concept in seconds — a fast,
          free way to see your idea take shape before any commitment.
        </p>
      </Container>

      <Container className="mt-14 max-w-3xl">
        <VisualizerExperience />
      </Container>
    </div>
  );
}
