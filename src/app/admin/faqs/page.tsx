import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminTable, AdminTableEmpty } from "@/components/admin/admin-table";
import { DeleteButton } from "@/components/admin/delete-button";
import { Button } from "@/components/ui/button";
import { deleteFaq } from "./actions";

export const metadata: Metadata = {
  title: "FAQs",
  robots: { index: false, follow: false },
};

export default async function AdminFaqsPage() {
  const supabase = await createClient();
  const { data: faqs } = await supabase
    .from("faq_items")
    .select("id, question, category, is_published, display_order")
    .order("display_order", { ascending: true });

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="FAQs"
        description="Manage frequently asked questions shown on the homepage and pricing page."
        action={
          <Button href="/admin/faqs/new" variant="gradient" size="sm">
            <Plus className="h-4 w-4" aria-hidden="true" />
            New FAQ
          </Button>
        }
      />

      <AdminTable>
        <thead>
          <tr className="border-b border-border bg-white/[0.02] text-xs uppercase tracking-wide text-muted">
            <th className="px-5 py-3 font-medium">Question</th>
            <th className="px-5 py-3 font-medium">Category</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {!faqs || faqs.length === 0 ? (
            <AdminTableEmpty colSpan={4}>No FAQs yet.</AdminTableEmpty>
          ) : (
            faqs.map((faq) => (
              <tr key={faq.id}>
                <td className="max-w-sm px-5 py-4 font-medium text-foreground">{faq.question}</td>
                <td className="px-5 py-4 text-xs text-muted">{faq.category ?? "—"}</td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${
                      faq.is_published
                        ? "border-accent-2/40 bg-accent-2/10 text-accent-2"
                        : "border-border-strong bg-white/5 text-muted"
                    }`}
                  >
                    {faq.is_published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/faqs/${faq.id}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border-strong bg-white/5 px-3 py-1 text-xs font-medium text-foreground/80 transition-colors hover:text-foreground"
                    >
                      <Pencil className="h-3 w-3" aria-hidden="true" />
                      Edit
                    </Link>
                    <DeleteButton id={faq.id} action={deleteFaq} confirmMessage="Delete this FAQ item?" />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </AdminTable>
    </div>
  );
}
