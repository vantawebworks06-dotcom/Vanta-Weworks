import { createClient } from "@/lib/supabase/server";

export type Testimonial = {
  id: string;
  client_name: string;
  client_title: string | null;
  company: string | null;
  quote: string;
  rating: number;
  avatar_url: string | null;
  is_placeholder: boolean;
  is_published: boolean;
};

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("id, client_name, client_title, company, quote, rating, avatar_url, is_placeholder, is_published")
    .eq("is_published", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Failed to load testimonials:", error.message);
    return [];
  }

  return data ?? [];
}
