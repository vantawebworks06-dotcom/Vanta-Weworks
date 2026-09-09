import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";

const variants = {
  primary:
    "bg-foreground text-background hover:opacity-90 active:opacity-80 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
  gradient:
    "text-white bg-[linear-gradient(135deg,#7c5cff,#5b8def_50%,#22d3ee)] bg-[length:160%_160%] bg-[position:0%_50%] hover:bg-[position:100%_50%] shadow-[0_8px_30px_-8px_rgba(124,92,255,0.55)]",
  outline:
    "border border-border-strong text-foreground hover:bg-white/5 hover:border-white/30",
  ghost: "text-foreground/80 hover:text-foreground hover:bg-white/5",
} as const;

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-base",
} as const;

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  href?: undefined;
};

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  size?: Size;
  href: string;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps | LinkButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (props.href) {
    const { href, ...anchorRest } = props as LinkButtonProps;
    return (
      <Link href={href} className={classes} {...anchorRest}>
        {props.children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as ButtonProps)}>
      {props.children}
    </button>
  );
}
