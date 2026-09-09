import type { LucideIcon } from "lucide-react";
import {
  Search,
  ClipboardList,
  PenTool,
  Code2,
  FlaskConical,
  Rocket,
  LifeBuoy,
} from "lucide-react";

export type ProcessStep = {
  step: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export const processSteps: ProcessStep[] = [
  {
    step: "01",
    title: "Discovery",
    description:
      "We learn about your business, goals, audience, and what success looks like for your website.",
    icon: Search,
  },
  {
    step: "02",
    title: "Planning",
    description:
      "We map out site structure, content requirements, and technical approach before any design starts.",
    icon: ClipboardList,
  },
  {
    step: "03",
    title: "Design",
    description:
      "Custom visual design tailored to your brand, reviewed and refined with you before development begins.",
    icon: PenTool,
  },
  {
    step: "04",
    title: "Development",
    description:
      "Your design is built with clean, modern code — responsive, fast, and production-ready.",
    icon: Code2,
  },
  {
    step: "05",
    title: "Testing",
    description:
      "Every page and interaction is tested across devices, browsers, and screen sizes before launch.",
    icon: FlaskConical,
  },
  {
    step: "06",
    title: "Launch",
    description:
      "Your site goes live on reliable, modern infrastructure with proper domain and SSL configuration.",
    icon: Rocket,
  },
  {
    step: "07",
    title: "Ongoing Support",
    description:
      "We remain available for updates, monitoring, and maintenance so your site stays current after launch.",
    icon: LifeBuoy,
  },
];
