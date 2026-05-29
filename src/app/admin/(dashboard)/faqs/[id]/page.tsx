import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/ui";
import { FaqForm } from "../faq-form";
import { updateFaq } from "../actions";

export const metadata = { title: "Edit FAQ" };

export default async function EditFaqPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const faq = await prisma.faq.findUnique({ where: { id } });
  if (!faq) notFound();

  return (
    <div>
      <Link
        href="/admin/faqs"
        className="inline-block text-xs uppercase tracking-[0.2em] text-ink-soft hover:text-rose-deep transition-colors mb-6"
      >
        ← FAQs
      </Link>
      <AdminHeader eyebrow="Site content" title="Edit FAQ" />
      <FaqForm
        action={updateFaq.bind(null, faq.id)}
        initial={{
          question: faq.question,
          answer: faq.answer,
          sortOrder: faq.sortOrder,
        }}
      />
    </div>
  );
}
