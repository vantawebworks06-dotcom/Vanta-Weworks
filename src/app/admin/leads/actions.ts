"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function toggleContactHandled(id: string, handled: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_submissions")
    .update({ is_handled: handled })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/leads");
}

export async function toggleLeadHandled(id: string, handled: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from("leads").update({ is_handled: handled }).eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/leads");
}
