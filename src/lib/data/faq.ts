import { createClient } from "@/lib/supabase/server";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category: string | null;
};

export async function getFaqItems(): Promise<FaqItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faq_items")
    .select("id, question, answer, category")
    .eq("is_published", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Failed to load FAQ items:", error.message);
    return [];
  }

  return data ?? [];
}
