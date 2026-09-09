"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Hides its children on /admin routes without forcing them to become
 * Client Components — Server Component children can be passed straight
 * through a Client Component via `children`, so e.g. <Footer /> (a Server
 * Component) stays server-rendered everywhere except /admin.
 */
export function HideOnAdmin({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <>{children}</>;
}
