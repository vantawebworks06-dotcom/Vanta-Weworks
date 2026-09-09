"use client";

import { Monitor, Tablet, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type Device = "desktop" | "tablet" | "mobile";

export const DEVICE_WIDTHS: Record<Device, string> = {
  desktop: "100%",
  tablet: "48rem",
  mobile: "23rem",
};

const options: { key: Device; label: string; icon: typeof Monitor }[] = [
  { key: "desktop", label: "Desktop", icon: Monitor },
  { key: "tablet", label: "Tablet", icon: Tablet },
  { key: "mobile", label: "Mobile", icon: Smartphone },
];

export function DeviceSwitcher({ value, onChange }: { value: Device; onChange: (device: Device) => void }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border bg-white/5 p-1" role="group" aria-label="Preview device size">
      {options.map((opt) => {
        const Icon = opt.icon;
        const active = value === opt.key;
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => onChange(opt.key)}
            aria-pressed={active}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              active ? "bg-white/10 text-foreground" : "text-muted hover:text-foreground"
            )}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
