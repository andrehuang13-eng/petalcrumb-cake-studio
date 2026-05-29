"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/dal";
import { slugify } from "@/lib/slug";

export type CategoryFormState = { error: string } | undefined;

const schema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(80),
  slug: z.string().trim().max(80).optional(),
});

function parse(formData: FormData) {
  return schema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
  });
}

export async function createCategory(
  _prev: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) return { error: "Please enter a valid name." };

  const name = parsed.data.name;
  const slug = slugify(parsed.data.slug || name);
  if (!slug) return { error: "Could not derive a slug from that name." };

  try {
    await prisma.category.create({ data: { name, slug } });
  } catch {
    return { error: "A category with that name or slug already exists." };
  }
  revalidatePath("/admin/categories");
  revalidatePath("/gallery");
  redirect("/admin/categories");
}

export async function updateCategory(
  id: string,
  _prev: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) return { error: "Please enter a valid name." };

  const name = parsed.data.name;
  const slug = slugify(parsed.data.slug || name);
  if (!slug) return { error: "Could not derive a slug from that name." };

  try {
    await prisma.category.update({ where: { id }, data: { name, slug } });
  } catch {
    return { error: "A category with that name or slug already exists." };
  }
  revalidatePath("/admin/categories");
  revalidatePath("/gallery");
  redirect("/admin/categories");
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  // Guard: don't orphan cakes. The UI hides delete when in use; this is defense.
  const count = await prisma.cake.count({ where: { categoryId: id } });
  if (count > 0) return;
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
  revalidatePath("/gallery");
}
