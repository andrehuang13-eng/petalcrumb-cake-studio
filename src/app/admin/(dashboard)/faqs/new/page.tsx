import Link from "next/link";
import { requireAdmin } from "@/lib/dal";
import { AdminHeader } from "@/components/admin/ui";
import { FaqForm } from "../faq-form";
import { createFaq } from "../actions";

export const metadata = { title: "New FAQ" };

export default async function NewFaqPage() {
  await requireAdmin();
  return (
    <div>
      <Link
        href="/admin/faqs"
        className="inline-block text-xs uppercase tracking-[0.2em] text-ink-soft hover:text-rose-deep transition-colors mb-6"
      >
        ← FAQs
      </Link>
      <AdminHeader eyebrow="Site content" title="New FAQ" />
      <FaqForm action={createFaq} />
    </div>
  );
}
