"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/dal";

export type SettingsFormState = { error: string } | { ok: true } | undefined;

const SINGLETON_ID = "singleton";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(200),
  phone: z.string().trim().min(1, "Phone is required").max(50),
  address: z.string().trim().min(1, "Address is required").max(300),
  openingHours: z.string().trim().min(1, "Opening hours are required").max(300),
  instagramUrl: z
    .string()
    .trim()
    .url("Enter a valid URL")
    .max(300)
    .or(z.literal("")),
});

export async function updateSettings(
  _prev: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  await requireAdmin();

  const parsed = schema.safeParse({
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    openingHours: formData.get("openingHours"),
    instagramUrl: formData.get("instagramUrl"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the fields." };
  }

  const data = parsed.data;
  await prisma.siteSettings.upsert({
    where: { id: SINGLETON_ID },
    update: data,
    create: { id: SINGLETON_ID, ...data },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout"); // footer reads settings
  revalidatePath("/contact");
  return { ok: true };
}
