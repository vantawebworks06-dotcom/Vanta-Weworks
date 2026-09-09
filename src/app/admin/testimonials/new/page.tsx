import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { TestimonialForm } from "@/components/admin/testimonial-form";
import { createTestimonial } from "../actions";

export const metadata: Metadata = {
  title: "New Testimonial",
  robots: { index: false, follow: false },
};

export default function NewTestimonialPage() {
  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <AdminPageHeader title="New Testimonial" description="Add a new client testimonial." />
      <TestimonialForm action={createTestimonial} submitLabel="Create Testimonial" />
    </div>
  );
}
