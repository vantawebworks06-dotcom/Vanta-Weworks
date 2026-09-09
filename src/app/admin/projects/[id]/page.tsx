import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ProjectForm } from "@/components/admin/project-form";
import { updateProject } from "../actions";

export const metadata: Metadata = {
  title: "Edit Project",
  robots: { index: false, follow: false },
};

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: project } = await supabase
    .from("portfolio_items")
    .select(
      "id, slug, title, summary, content, client_name, industry, services_provided, technologies, results, project_url, display_order, is_published, is_placeholder"
    )
    .eq("id", id)
    .maybeSingle();

  if (!project) notFound();

  const boundAction = updateProject.bind(null, project.id);

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <AdminPageHeader title="Edit Project" description={project.title} />
      <ProjectForm action={boundAction} defaultValues={project} submitLabel="Save Changes" />
    </div>
  );
}
