import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/admin");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    // /unauthorized lives outside /admin specifically so it doesn't run
    // through this same check and loop.
    redirect("/unauthorized");
  }

  return (
    <div className="flex min-h-[calc(100vh-1px)] flex-1 flex-col lg:flex-row">
      <AdminSidebar userEmail={user.email ?? ""} />
      <div className="flex flex-1 flex-col">
        <AdminMobileNav />
        <main className="flex-1 p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
