"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/dal";

export type FaqFormState = { error: string } | undefined;

const schema = z.object({
  question: z.string().trim().min(5, "Question is too short").max(300),
  answer: z.string().trim().min(5, "Answer is too short").max(2000),
  sortOrder: z.coerce.number().int().min(0).max(9999),
});

function parse(formData: FormData) {
  return schema.safeParse({
    question: formData.get("question"),
    answer: formData.get("answer"),
    sortOrder: formData.get("sortOrder") || 0,
  });
}

export async function createFaq(
  _prev: FaqFormState,
  formData: FormData,
): Promise<FaqFormState> {
  await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) return { error: "Please fill in both fields." };
  await prisma.faq.create({ data: parsed.data });
  revalidatePath("/admin/faqs");
  revalidatePath("/faq");
  redirect("/admin/faqs");
}

export async function updateFaq(
  id: string,
  _prev: FaqFormState,
  formData: FormData,
): Promise<FaqFormState> {
  await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) return { error: "Please fill in both fields." };
  await prisma.faq.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/faqs");
  revalidatePath("/faq");
  redirect("/admin/faqs");
}

export async function deleteFaq(id: string) {
  await requireAdmin();
  await prisma.faq.delete({ where: { id } });
  revalidatePath("/admin/faqs");
  revalidatePath("/faq");
}
