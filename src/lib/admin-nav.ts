import {
  LayoutDashboard,
  Inbox,
  Wand2,
  FolderKanban,
  MessageSquareQuote,
  HelpCircle,
  Settings,
} from "lucide-react";

export const adminNavLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/leads", label: "Leads & Inquiries", icon: Inbox, exact: false },
  { href: "/admin/visualizations", label: "Visualizations", icon: Wand2, exact: false },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban, exact: false },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote, exact: false },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle, exact: false },
  { href: "/admin/settings", label: "Settings", icon: Settings, exact: false },
] as const;
