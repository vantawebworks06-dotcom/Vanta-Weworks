import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ProjectForm } from "@/components/admin/project-form";
import { createProject } from "../actions";

export const metadata: Metadata = {
  title: "New Project",
  robots: { index: false, follow: false },
};

export default function NewProjectPage() {
  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <AdminPageHeader title="New Project" description="Add a new portfolio case study." />
      <ProjectForm action={createProject} submitLabel="Create Project" />
    </div>
  );
}
