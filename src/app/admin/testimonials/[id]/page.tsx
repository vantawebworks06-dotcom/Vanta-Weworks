import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { TestimonialForm } from "@/components/admin/testimonial-form";
import { updateTestimonial } from "../actions";

export const metadata: Metadata = {
  title: "Edit Testimonial",
  robots: { index: false, follow: false },
};

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: testimonial } = await supabase
    .from("testimonials")
    .select("id, client_name, client_title, company, quote, rating, is_published, is_placeholder, display_order")
    .eq("id", id)
    .maybeSingle();

  if (!testimonial) notFound();

  const boundAction = updateTestimonial.bind(null, testimonial.id);

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <AdminPageHeader title="Edit Testimonial" description={testimonial.client_name} />
      <TestimonialForm action={boundAction} defaultValues={testimonial} submitLabel="Save Changes" />
    </div>
  );
}
