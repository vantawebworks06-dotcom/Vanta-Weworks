import { createClient } from "@/lib/supabase/server";

export type Project = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  content: string | null;
  cover_image_path: string | null;
  client_name: string | null;
  industry: string | null;
  services_provided: string[];
  technologies: string[];
  results: string | null;
  project_url: string | null;
  is_placeholder: boolean;
  display_order: number;
};

const PROJECT_COLUMNS =
  "id, slug, title, summary, content, cover_image_path, client_name, industry, services_provided, technologies, results, project_url, is_placeholder, display_order";

export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("portfolio_items")
    .select(PROJECT_COLUMNS)
    .eq("is_published", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Failed to load portfolio items:", error.message);
    return [];
  }

  return data ?? [];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("portfolio_items")
    .select(PROJECT_COLUMNS)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    console.error("Failed to load portfolio item:", error.message);
    return null;
  }

  return data;
}
