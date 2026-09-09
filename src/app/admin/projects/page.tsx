import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminTable, AdminTableEmpty } from "@/components/admin/admin-table";
import { DeleteButton } from "@/components/admin/delete-button";
import { Button } from "@/components/ui/button";
import { ExampleBadge } from "@/components/ui/example-badge";
import { deleteProject } from "./actions";

export const metadata: Metadata = {
  title: "Projects",
  robots: { index: false, follow: false },
};

export default async function AdminProjectsPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("portfolio_items")
    .select("id, slug, title, industry, is_published, is_placeholder, display_order")
    .order("display_order", { ascending: true });

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Projects"
        description="Manage portfolio case studies shown on the public Portfolio page."
        action={
          <Button href="/admin/projects/new" variant="gradient" size="sm">
            <Plus className="h-4 w-4" aria-hidden="true" />
            New Project
          </Button>
        }
      />

      <AdminTable>
        <thead>
          <tr className="border-b border-border bg-white/[0.02] text-xs uppercase tracking-wide text-muted">
            <th className="px-5 py-3 font-medium">Title</th>
            <th className="px-5 py-3 font-medium">Industry</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {!projects || projects.length === 0 ? (
            <AdminTableEmpty colSpan={4}>No projects yet.</AdminTableEmpty>
          ) : (
            projects.map((project) => (
              <tr key={project.id}>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{project.title}</span>
                    {project.is_placeholder ? <ExampleBadge /> : null}
                  </div>
                  <span className="text-xs text-muted">/{project.slug}</span>
                </td>
                <td className="px-5 py-4 text-xs text-muted">{project.industry ?? "—"}</td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${
                      project.is_published
                        ? "border-accent-2/40 bg-accent-2/10 text-accent-2"
                        : "border-border-strong bg-white/5 text-muted"
                    }`}
                  >
                    {project.is_published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border-strong bg-white/5 px-3 py-1 text-xs font-medium text-foreground/80 transition-colors hover:text-foreground"
                    >
                      <Pencil className="h-3 w-3" aria-hidden="true" />
                      Edit
                    </Link>
                    <DeleteButton id={project.id} action={deleteProject} confirmMessage={`Delete "${project.title}"? This can't be undone.`} />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </AdminTable>
    </div>
  );
}
