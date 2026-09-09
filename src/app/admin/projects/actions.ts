"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { projectSchema } from "@/lib/validations/admin-content";

export type ActionState = { error?: string; fieldErrors?: Record<string, string> } | null;

function parseFormData(formData: FormData) {
  return {
    slug: String(formData.get("slug") ?? ""),
    title: String(formData.get("title") ?? ""),
    summary: String(formData.get("summary") ?? ""),
    content: String(formData.get("content") ?? ""),
    client_name: String(formData.get("client_name") ?? ""),
    industry: String(formData.get("industry") ?? ""),
    services_provided: formData.getAll("services_provided").map(String),
    technologies: String(formData.get("technologies") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    results: String(formData.get("results") ?? ""),
    project_url: String(formData.get("project_url") ?? ""),
    display_order: formData.get("display_order") ?? 0,
    is_published: formData.get("is_published") === "on",
    is_placeholder: formData.get("is_placeholder") === "on",
  };
}

function toFieldErrors(error: import("zod").ZodError) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    fieldErrors[issue.path[0] as string] = issue.message;
  }
  return fieldErrors;
}

export async function createProject(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = projectSchema.safeParse(parseFormData(formData));
  if (!parsed.success) {
    return { error: "Please fix the errors below.", fieldErrors: toFieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("portfolio_items").insert({
    ...parsed.data,
    summary: parsed.data.summary || null,
    content: parsed.data.content || null,
    client_name: parsed.data.client_name || null,
    industry: parsed.data.industry || null,
    results: parsed.data.results || null,
    project_url: parsed.data.project_url || null,
  });

  if (error) {
    return { error: error.code === "23505" ? "A project with this slug already exists." : error.message };
  }

  revalidatePath("/admin/projects");
  revalidatePath("/portfolio");
  redirect("/admin/projects");
}

export async function updateProject(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = projectSchema.safeParse(parseFormData(formData));
  if (!parsed.success) {
    return { error: "Please fix the errors below.", fieldErrors: toFieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("portfolio_items")
    .update({
      ...parsed.data,
      summary: parsed.data.summary || null,
      content: parsed.data.content || null,
      client_name: parsed.data.client_name || null,
      industry: parsed.data.industry || null,
      results: parsed.data.results || null,
      project_url: parsed.data.project_url || null,
    })
    .eq("id", id);

  if (error) {
    return { error: error.code === "23505" ? "A project with this slug already exists." : error.message };
  }

  revalidatePath("/admin/projects");
  revalidatePath("/portfolio");
  revalidatePath(`/portfolio/${parsed.data.slug}`);
  redirect("/admin/projects");
}

export async function deleteProject(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("portfolio_items").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/projects");
  revalidatePath("/portfolio");
}
