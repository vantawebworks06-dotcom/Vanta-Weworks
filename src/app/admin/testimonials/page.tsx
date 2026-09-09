import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminTable, AdminTableEmpty } from "@/components/admin/admin-table";
import { DeleteButton } from "@/components/admin/delete-button";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/star-rating";
import { ExampleBadge } from "@/components/ui/example-badge";
import { deleteTestimonial } from "./actions";

export const metadata: Metadata = {
  title: "Testimonials",
  robots: { index: false, follow: false },
};

export default async function AdminTestimonialsPage() {
  const supabase = await createClient();
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("id, client_name, company, rating, is_published, is_placeholder, display_order")
    .order("display_order", { ascending: true });

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Testimonials"
        description="Manage client testimonials shown on the homepage."
        action={
          <Button href="/admin/testimonials/new" variant="gradient" size="sm">
            <Plus className="h-4 w-4" aria-hidden="true" />
            New Testimonial
          </Button>
        }
      />

      <AdminTable>
        <thead>
          <tr className="border-b border-border bg-white/[0.02] text-xs uppercase tracking-wide text-muted">
            <th className="px-5 py-3 font-medium">Client</th>
            <th className="px-5 py-3 font-medium">Rating</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {!testimonials || testimonials.length === 0 ? (
            <AdminTableEmpty colSpan={4}>No testimonials yet.</AdminTableEmpty>
          ) : (
            testimonials.map((t) => (
              <tr key={t.id}>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{t.client_name}</span>
                    {t.is_placeholder ? <ExampleBadge /> : null}
                  </div>
                  {t.company ? <span className="text-xs text-muted">{t.company}</span> : null}
                </td>
                <td className="px-5 py-4">
                  <StarRating rating={t.rating} />
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${
                      t.is_published
                        ? "border-accent-2/40 bg-accent-2/10 text-accent-2"
                        : "border-border-strong bg-white/5 text-muted"
                    }`}
                  >
                    {t.is_published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/testimonials/${t.id}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border-strong bg-white/5 px-3 py-1 text-xs font-medium text-foreground/80 transition-colors hover:text-foreground"
                    >
                      <Pencil className="h-3 w-3" aria-hidden="true" />
                      Edit
                    </Link>
                    <DeleteButton id={t.id} action={deleteTestimonial} confirmMessage={`Delete testimonial from "${t.client_name}"?`} />
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
