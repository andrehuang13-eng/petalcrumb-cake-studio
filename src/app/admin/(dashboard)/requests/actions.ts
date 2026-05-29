"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { OrderRequestStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/dal";

const VALID_STATUSES = Object.values(OrderRequestStatus) as string[];

// Update status + admin notes together (one form on the detail page).
export async function updateRequest(id: string, formData: FormData) {
  await requireAdmin();

  const status = String(formData.get("status") ?? "");
  if (!VALID_STATUSES.includes(status)) return;

  const notesRaw = String(formData.get("adminNotes") ?? "").trim();

  await prisma.orderRequest.update({
    where: { id },
    data: {
      status: status as OrderRequestStatus,
      adminNotes: notesRaw || null,
    },
  });

  revalidatePath("/admin/requests");
  revalidatePath(`/admin/requests/${id}`);
}

export async function deleteRequest(id: string) {
  await requireAdmin();
  await prisma.orderRequest.delete({ where: { id } });
  revalidatePath("/admin/requests");
  redirect("/admin/requests");
}
