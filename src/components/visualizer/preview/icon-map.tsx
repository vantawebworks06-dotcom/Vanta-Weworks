import {
  Sparkles,
  Star,
  Heart,
  Shield,
  Rocket,
  Leaf,
  Gem,
  Clock,
  Phone,
  Mail,
  MapPin,
  Utensils,
  Hammer,
  Briefcase,
  Home,
  Camera,
  Palette,
  Scale,
  ShoppingBag,
  Dumbbell,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";

/** Maps the small fixed vocabulary of icon names the AI is instructed to use onto real icons. */
const ICONS: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  star: Star,
  heart: Heart,
  shield: Shield,
  rocket: Rocket,
  leaf: Leaf,
  gem: Gem,
  clock: Clock,
  phone: Phone,
  mail: Mail,
  mapPin: MapPin,
  utensils: Utensils,
  hammer: Hammer,
  briefcase: Briefcase,
  home: Home,
  camera: Camera,
  palette: Palette,
  scale: Scale,
  shoppingBag: ShoppingBag,
  dumbbell: Dumbbell,
};

export function resolveIcon(name: string | undefined): LucideIcon {
  if (!name) return CheckCircle2;
  return ICONS[name] ?? CheckCircle2;
}
