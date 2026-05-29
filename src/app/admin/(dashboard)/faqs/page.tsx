import Link from "next/link";
import { requireAdmin } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { AdminHeader, ButtonLink } from "@/components/admin/ui";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteFaq } from "./actions";

export const metadata = { title: "FAQs" };

export default async function FaqsPage() {
  await requireAdmin();
  const faqs = await prisma.faq.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return (
    <div>
      <AdminHeader
        eyebrow="Site content"
        title="FAQs"
        action={<ButtonLink href="/admin/faqs/new">+ New FAQ</ButtonLink>}
      />

      {faqs.length === 0 ? (
        <p className="text-ink-mute text-sm py-12 text-center border border-dashed border-line rounded-sm">
          No FAQs yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {faqs.map((f) => (
            <li
              key={f.id}
              className="border border-line rounded-sm p-5 flex items-start justify-between gap-6"
            >
              <div className="min-w-0">
                <p className="font-display text-lg text-ink mb-1">
                  {f.question}
                </p>
                <p className="text-ink-soft text-sm line-clamp-2">{f.answer}</p>
              </div>
              <div className="flex items-center gap-4 shrink-0 pt-1">
                <span className="text-xs text-ink-mute tabular-nums">
                  #{f.sortOrder}
                </span>
                <Link
                  href={`/admin/faqs/${f.id}`}
                  className="text-xs uppercase tracking-[0.15em] text-ink-soft hover:text-rose-deep transition-colors"
                >
                  Edit
                </Link>
                <DeleteButton
                  action={deleteFaq.bind(null, f.id)}
                  label="Delete"
                  confirmText="Delete this FAQ?"
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
