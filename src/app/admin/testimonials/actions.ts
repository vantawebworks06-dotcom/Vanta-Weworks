"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { testimonialSchema } from "@/lib/validations/admin-content";
import type { ActionState } from "@/app/admin/projects/actions";

function parseFormData(formData: FormData) {
  return {
    client_name: String(formData.get("client_name") ?? ""),
    client_title: String(formData.get("client_title") ?? ""),
    company: String(formData.get("company") ?? ""),
    quote: String(formData.get("quote") ?? ""),
    rating: formData.get("rating") ?? 5,
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

export async function createTestimonial(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = testimonialSchema.safeParse(parseFormData(formData));
  if (!parsed.success) {
    return { error: "Please fix the errors below.", fieldErrors: toFieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").insert({
    ...parsed.data,
    client_title: parsed.data.client_title || null,
    company: parsed.data.company || null,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  redirect("/admin/testimonials");
}

export async function updateTestimonial(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = testimonialSchema.safeParse(parseFormData(formData));
  if (!parsed.success) {
    return { error: "Please fix the errors below.", fieldErrors: toFieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("testimonials")
    .update({
      ...parsed.data,
      client_title: parsed.data.client_title || null,
      company: parsed.data.company || null,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  redirect("/admin/testimonials");
}

export async function deleteTestimonial(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}
