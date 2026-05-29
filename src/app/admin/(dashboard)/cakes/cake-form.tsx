"use client";

import { useActionState } from "react";
import { Field, inputCx } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/submit-button";
import type { CakeFormState } from "./actions";

type Action = (prev: CakeFormState, formData: FormData) => Promise<CakeFormState>;

type Initial = {
  title: string;
  slug: string;
  description: string;
  categoryId: string;
  basePricePounds: number;
  leadTimeDays: number;
  allergenNotes: string;
  status: string;
  featured: boolean;
  flavors: string;
};

export function CakeForm({
  action,
  categories,
  initial,
  submitLabel = "Save cake",
}: {
  action: Action;
  categories: { id: string; name: string }[];
  initial?: Initial;
  submitLabel?: string;
}) {
  const [state, formAction] = useActionState<CakeFormState, FormData>(
    action,
    undefined,
  );

  return (
    <form action={formAction} className="space-y-5 max-w-2xl">
      <Field label="Title" htmlFor="title">
        <input id="title" name="title" type="text" required defaultValue={initial?.title} className={inputCx} />
      </Field>

      <Field label="Slug" htmlFor="slug" hint="Leave blank to generate from the title.">
        <input id="slug" name="slug" type="text" defaultValue={initial?.slug} className={inputCx} placeholder="auto" />
      </Field>

      <Field label="Category" htmlFor="categoryId">
        <select id="categoryId" name="categoryId" required defaultValue={initial?.categoryId ?? ""} className={inputCx}>
          <option value="" disabled>Choose a category…</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </Field>

      <Field label="Description" htmlFor="description">
        <textarea id="description" name="description" rows={5} required defaultValue={initial?.description} className={`${inputCx} resize-y`} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Base price (£)" htmlFor="basePricePounds" hint="Starting 'from' price.">
          <input id="basePricePounds" name="basePricePounds" type="number" min={0} step="1" required defaultValue={initial?.basePricePounds} className={inputCx} />
        </Field>
        <Field label="Lead time (days)" htmlFor="leadTimeDays">
          <input id="leadTimeDays" name="leadTimeDays" type="number" min={0} required defaultValue={initial?.leadTimeDays} className={inputCx} />
        </Field>
      </div>

      <Field label="Flavours" htmlFor="flavors" hint="Comma-separated, e.g. Vanilla, Raspberry, Almond.">
        <input id="flavors" name="flavors" type="text" defaultValue={initial?.flavors} className={inputCx} />
      </Field>

      <Field label="Allergen notes" htmlFor="allergenNotes">
        <input id="allergenNotes" name="allergenNotes" type="text" defaultValue={initial?.allergenNotes} className={inputCx} placeholder="Contains nuts, dairy, gluten…" />
      </Field>

      <div className="grid grid-cols-2 gap-4 items-end">
        <Field label="Status" htmlFor="status">
          <select id="status" name="status" defaultValue={initial?.status ?? "DRAFT"} className={inputCx}>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </Field>
        <label className="flex items-center gap-2 pb-2.5 text-sm text-ink">
          <input type="checkbox" name="featured" defaultChecked={initial?.featured} className="accent-rose-deep w-4 h-4" />
          Featured on gallery
        </label>
      </div>

      {state?.error && (
        <p role="alert" className="text-rose-deep text-sm">{state.error}</p>
      )}

      <SubmitButton>{submitLabel}</SubmitButton>
    </form>
  );
}
