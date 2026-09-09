import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { FaqForm } from "@/components/admin/faq-form";
import { updateFaq } from "../actions";

export const metadata: Metadata = {
  title: "Edit FAQ",
  robots: { index: false, follow: false },
};

export default async function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: faq } = await supabase
    .from("faq_items")
    .select("id, question, answer, category, is_published, display_order")
    .eq("id", id)
    .maybeSingle();

  if (!faq) notFound();

  const boundAction = updateFaq.bind(null, faq.id);

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <AdminPageHeader title="Edit FAQ" description={faq.question} />
      <FaqForm action={boundAction} defaultValues={faq} submitLabel="Save Changes" />
    </div>
  );
}
