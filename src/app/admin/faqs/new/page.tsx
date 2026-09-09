import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { FaqForm } from "@/components/admin/faq-form";
import { createFaq } from "../actions";

export const metadata: Metadata = {
  title: "New FAQ",
  robots: { index: false, follow: false },
};

export default function NewFaqPage() {
  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <AdminPageHeader title="New FAQ" description="Add a new frequently asked question." />
      <FaqForm action={createFaq} submitLabel="Create FAQ" />
    </div>
  );
}
