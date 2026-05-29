import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { AdminHeader, Badge, Field, inputCx, labelCx } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/submit-button";
import { DeleteButton } from "@/components/admin/delete-button";
import { CakeForm } from "../cake-form";
import {
  updateCake,
  uploadCakeImage,
  addCakeImageUrl,
  deleteCakeImage,
  setPrimaryImage,
  addSizeOption,
  deleteSizeOption,
} from "../actions";

export const metadata = { title: "Edit cake" };

const price = (cents: number) => `£${(cents / 100).toFixed(0)}`;

export default async function EditCakePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const [cake, categories] = await Promise.all([
    prisma.cake.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        sizeOptions: { orderBy: { sortOrder: "asc" } },
      },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!cake) notFound();

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/cakes"
        className="inline-block text-xs uppercase tracking-[0.2em] text-ink-soft hover:text-rose-deep transition-colors mb-6"
      >
        ← Cakes
      </Link>
      <AdminHeader
        eyebrow="Catalogue"
        title={`Edit · ${cake.title}`}
        action={
          <Link
            href={`/cakes/${cake.slug}`}
            className="text-xs uppercase tracking-[0.2em] text-ink-soft hover:text-rose-deep transition-colors"
          >
            View live →
          </Link>
        }
      />

      <CakeForm
        action={updateCake.bind(null, cake.id)}
        categories={categories}
        submitLabel="Save changes"
        initial={{
          title: cake.title,
          slug: cake.slug,
          description: cake.description,
          categoryId: cake.categoryId,
          basePricePounds: cake.basePriceCents / 100,
          leadTimeDays: cake.leadTimeDays,
          allergenNotes: cake.allergenNotes ?? "",
          status: cake.status,
          featured: cake.featured,
          flavors: cake.flavors.join(", "),
        }}
      />

      {/* ---- Images ---- */}
      <section className="mt-12 pt-8 border-t border-line">
        <h2 className="font-display text-2xl mb-5">Images</h2>

        {cake.images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            {cake.images.map((img) => (
              <div key={img.id} className="border border-line rounded-sm overflow-hidden bg-cream-soft">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.altText} className="w-full aspect-square object-cover" />
                <div className="p-2 flex items-center justify-between gap-2">
                  {img.isPrimary ? (
                    <Badge tone="rose">Primary</Badge>
                  ) : (
                    <form action={setPrimaryImage.bind(null, img.id)}>
                      <button type="submit" className="text-[10px] uppercase tracking-[0.15em] text-ink-soft hover:text-rose-deep transition-colors">
                        Make primary
                      </button>
                    </form>
                  )}
                  <DeleteButton action={deleteCakeImage.bind(null, img.id)} label="Remove" confirmText="Remove this image?" />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-6">
          {/* Upload from device */}
          <form action={uploadCakeImage.bind(null, cake.id)} className="space-y-3 border border-line rounded-sm p-4">
            <p className={labelCx}>Upload an image</p>
            <input type="file" name="file" accept="image/*" required className="block w-full text-xs text-ink-soft file:mr-3 file:rounded-sm file:border file:border-line file:bg-cream file:px-3 file:py-1.5 file:text-xs file:uppercase file:tracking-[0.15em]" />
            <input type="text" name="altText" placeholder="Alt text (optional)" className={inputCx} />
            <SubmitButton variant="ghost" pendingText="Uploading…">Upload</SubmitButton>
          </form>

          {/* Add by URL */}
          <form action={addCakeImageUrl.bind(null, cake.id)} className="space-y-3 border border-line rounded-sm p-4">
            <p className={labelCx}>…or add by URL</p>
            <input type="url" name="url" placeholder="https://…" required className={inputCx} />
            <input type="text" name="altText" placeholder="Alt text (optional)" className={inputCx} />
            <SubmitButton variant="ghost" pendingText="Adding…">Add URL</SubmitButton>
          </form>
        </div>
      </section>

      {/* ---- Sizes ---- */}
      <section className="mt-12 pt-8 border-t border-line">
        <h2 className="font-display text-2xl mb-5">Size options</h2>

        {cake.sizeOptions.length > 0 && (
          <ul className="mb-6 divide-y divide-line border border-line rounded-sm">
            {cake.sizeOptions.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-4 px-4 py-3">
                <span className="text-ink">{s.label}</span>
                <div className="flex items-center gap-5">
                  <span className="font-display text-lg tabular-nums">{price(s.priceCents)}</span>
                  <DeleteButton action={deleteSizeOption.bind(null, s.id)} label="Remove" confirmText="Remove this size?" />
                </div>
              </li>
            ))}
          </ul>
        )}

        <form action={addSizeOption.bind(null, cake.id)} className="flex flex-wrap items-end gap-3 border border-line rounded-sm p-4">
          <div className="flex-1 min-w-[12rem]">
            <Field label="Label" htmlFor="label">
              <input id="label" name="label" type="text" required placeholder="8-inch round (serves 20)" className={inputCx} />
            </Field>
          </div>
          <div className="w-28">
            <Field label="Price (£)" htmlFor="pricePounds">
              <input id="pricePounds" name="pricePounds" type="number" min={0} step="1" required className={inputCx} />
            </Field>
          </div>
          <SubmitButton variant="ghost">Add size</SubmitButton>
        </form>
      </section>
    </div>
  );
}
