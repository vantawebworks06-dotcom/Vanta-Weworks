"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { adminNavLinks } from "@/lib/admin-nav";
import { Logo } from "@/components/layout/logo";
import { LogoutButton } from "@/components/admin/logout-button";

export function AdminMobileNav() {
  const pathname = usePathname();

  return (
    <div className="border-b border-border bg-surface/40 lg:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <Logo />
        <LogoutButton />
      </div>
      <nav
        aria-label="Admin"
        className="flex gap-1 overflow-x-auto px-4 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {adminNavLinks.map((link) => {
          const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-medium transition-colors",
                active ? "bg-white/10 text-foreground" : "text-muted hover:bg-white/5 hover:text-foreground"
              )}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
