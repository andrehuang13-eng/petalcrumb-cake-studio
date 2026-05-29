"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { put, del } from "@vercel/blob";
import { z } from "zod";
import { CakeStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/dal";
import { slugify } from "@/lib/slug";

export type CakeFormState = { error: string } | undefined;

const BLOB_HOST = ".public.blob.vercel-storage.com";

const cakeSchema = z.object({
  title: z.string().trim().min(2, "Title is too short").max(120),
  slug: z.string().trim().max(120).optional(),
  description: z.string().trim().min(10, "Description is too short").max(4000),
  categoryId: z.string().min(1, "Choose a category"),
  basePricePounds: z.coerce.number().min(0).max(100000),
  leadTimeDays: z.coerce.number().int().min(0).max(365),
  allergenNotes: z.string().trim().max(1000).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  flavors: z.string().trim().max(500).optional(),
});

function readCakeForm(formData: FormData) {
  const parsed = cakeSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    categoryId: formData.get("categoryId"),
    basePricePounds: formData.get("basePricePounds"),
    leadTimeDays: formData.get("leadTimeDays"),
    allergenNotes: formData.get("allergenNotes") || undefined,
    status: formData.get("status"),
    flavors: formData.get("flavors") || undefined,
  });
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Please check the fields." };
  }
  const d = parsed.data;
  return {
    ok: true as const,
    data: {
      title: d.title,
      slug: slugify(d.slug || d.title),
      description: d.description,
      categoryId: d.categoryId,
      basePriceCents: Math.round(d.basePricePounds * 100),
      leadTimeDays: d.leadTimeDays,
      allergenNotes: d.allergenNotes?.trim() || null,
      status: d.status as CakeStatus,
      featured: formData.get("featured") === "on",
      flavors: (d.flavors ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    },
  };
}

function revalidateCake(slug?: string) {
  revalidatePath("/admin/cakes");
  revalidatePath("/gallery");
  if (slug) revalidatePath(`/cakes/${slug}`);
}

export async function createCake(
  _prev: CakeFormState,
  formData: FormData,
): Promise<CakeFormState> {
  await requireAdmin();
  const result = readCakeForm(formData);
  if (!result.ok) return { error: result.error };
  if (!result.data.slug) return { error: "Could not derive a slug from the title." };

  let cakeId: string;
  try {
    const cake = await prisma.cake.create({ data: result.data });
    cakeId = cake.id;
  } catch {
    return { error: "A cake with that slug already exists — pick a different title or slug." };
  }
  revalidateCake(result.data.slug);
  // Continue to the edit page to add images + sizes.
  redirect(`/admin/cakes/${cakeId}`);
}

export async function updateCake(
  id: string,
  _prev: CakeFormState,
  formData: FormData,
): Promise<CakeFormState> {
  await requireAdmin();
  const result = readCakeForm(formData);
  if (!result.ok) return { error: result.error };
  if (!result.data.slug) return { error: "Could not derive a slug from the title." };

  try {
    await prisma.cake.update({ where: { id }, data: result.data });
  } catch {
    return { error: "A cake with that slug already exists — pick a different title or slug." };
  }
  revalidateCake(result.data.slug);
  redirect("/admin/cakes");
}

export async function deleteCake(id: string) {
  await requireAdmin();
  const cake = await prisma.cake.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!cake) return;

  // Best-effort: remove uploaded blobs (skip external/seed URLs).
  await Promise.allSettled(
    cake.images
      .filter((img) => img.url.includes(BLOB_HOST))
      .map((img) => del(img.url)),
  );

  await prisma.cake.delete({ where: { id } });
  revalidateCake(cake.slug);
  redirect("/admin/cakes");
}

// ---- Images ----

export async function uploadCakeImage(cakeId: string, formData: FormData) {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return;

  const blob = await put(`cakes/${cakeId}/${file.name}`, file, {
    access: "public",
    addRandomSuffix: true,
  });

  await attachImage(cakeId, blob.url, String(formData.get("altText") ?? "").trim());
}

export async function addCakeImageUrl(cakeId: string, formData: FormData) {
  await requireAdmin();
  const url = String(formData.get("url") ?? "").trim();
  if (!/^https?:\/\//.test(url)) return;
  await attachImage(cakeId, url, String(formData.get("altText") ?? "").trim());
}

async function attachImage(cakeId: string, url: string, altText: string) {
  const [count, agg] = await Promise.all([
    prisma.cakeImage.count({ where: { cakeId } }),
    prisma.cakeImage.aggregate({ where: { cakeId }, _max: { sortOrder: true } }),
  ]);
  const cake = await prisma.cake.findUnique({ where: { id: cakeId }, select: { title: true, slug: true } });
  await prisma.cakeImage.create({
    data: {
      cakeId,
      url,
      altText: altText || cake?.title || "Cake image",
      sortOrder: (agg._max.sortOrder ?? -1) + 1,
      isPrimary: count === 0, // first image becomes primary
    },
  });
  revalidatePath(`/admin/cakes/${cakeId}`);
  revalidateCake(cake?.slug);
}

export async function deleteCakeImage(imageId: string) {
  await requireAdmin();
  const img = await prisma.cakeImage.findUnique({
    where: { id: imageId },
    include: { cake: { select: { slug: true } } },
  });
  if (!img) return;

  if (img.url.includes(BLOB_HOST)) {
    await del(img.url).catch(() => {});
  }
  await prisma.cakeImage.delete({ where: { id: imageId } });

  // If we removed the primary image, promote another one.
  const remaining = await prisma.cakeImage.findFirst({
    where: { cakeId: img.cakeId },
    orderBy: { sortOrder: "asc" },
  });
  if (img.isPrimary && remaining) {
    await prisma.cakeImage.update({
      where: { id: remaining.id },
      data: { isPrimary: true },
    });
  }
  revalidatePath(`/admin/cakes/${img.cakeId}`);
  revalidateCake(img.cake.slug);
}

export async function setPrimaryImage(imageId: string) {
  await requireAdmin();
  const img = await prisma.cakeImage.findUnique({
    where: { id: imageId },
    include: { cake: { select: { slug: true } } },
  });
  if (!img) return;
  await prisma.$transaction([
    prisma.cakeImage.updateMany({
      where: { cakeId: img.cakeId },
      data: { isPrimary: false },
    }),
    prisma.cakeImage.update({ where: { id: imageId }, data: { isPrimary: true } }),
  ]);
  revalidatePath(`/admin/cakes/${img.cakeId}`);
  revalidateCake(img.cake.slug);
}

// ---- Size options ----

export async function addSizeOption(cakeId: string, formData: FormData) {
  await requireAdmin();
  const label = String(formData.get("label") ?? "").trim();
  const pounds = Number(formData.get("pricePounds"));
  if (!label || !Number.isFinite(pounds) || pounds < 0) return;

  const agg = await prisma.sizeOption.aggregate({
    where: { cakeId },
    _max: { sortOrder: true },
  });
  await prisma.sizeOption.create({
    data: {
      cakeId,
      label,
      priceCents: Math.round(pounds * 100),
      sortOrder: (agg._max.sortOrder ?? -1) + 1,
    },
  });
  const cake = await prisma.cake.findUnique({ where: { id: cakeId }, select: { slug: true } });
  revalidatePath(`/admin/cakes/${cakeId}`);
  revalidateCake(cake?.slug);
}

export async function deleteSizeOption(sizeId: string) {
  await requireAdmin();
  const size = await prisma.sizeOption.findUnique({
    where: { id: sizeId },
    include: { cake: { select: { slug: true } } },
  });
  if (!size) return;
  await prisma.sizeOption.delete({ where: { id: sizeId } });
  revalidatePath(`/admin/cakes/${size.cakeId}`);
  revalidateCake(size.cake.slug);
}
