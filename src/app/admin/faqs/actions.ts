"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { faqSchema } from "@/lib/validations/admin-content";
import type { ActionState } from "@/app/admin/projects/actions";

function parseFormData(formData: FormData) {
  return {
    question: String(formData.get("question") ?? ""),
    answer: String(formData.get("answer") ?? ""),
    category: String(formData.get("category") ?? ""),
    display_order: formData.get("display_order") ?? 0,
    is_published: formData.get("is_published") === "on",
  };
}

function toFieldErrors(error: import("zod").ZodError) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    fieldErrors[issue.path[0] as string] = issue.message;
  }
  return fieldErrors;
}

export async function createFaq(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = faqSchema.safeParse(parseFormData(formData));
  if (!parsed.success) {
    return { error: "Please fix the errors below.", fieldErrors: toFieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("faq_items").insert({
    ...parsed.data,
    category: parsed.data.category || null,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/faqs");
  revalidatePath("/");
  revalidatePath("/pricing");
  redirect("/admin/faqs");
}

export async function updateFaq(id: string, _prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = faqSchema.safeParse(parseFormData(formData));
  if (!parsed.success) {
    return { error: "Please fix the errors below.", fieldErrors: toFieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("faq_items")
    .update({ ...parsed.data, category: parsed.data.category || null })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/faqs");
  revalidatePath("/");
  revalidatePath("/pricing");
  redirect("/admin/faqs");
}

export async function deleteFaq(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("faq_items").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/faqs");
  revalidatePath("/");
  revalidatePath("/pricing");
}
