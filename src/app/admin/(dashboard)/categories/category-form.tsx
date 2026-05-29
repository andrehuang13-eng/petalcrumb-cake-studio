"use client";

import { useActionState } from "react";
import { Field, inputCx } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/submit-button";
import type { CategoryFormState } from "./actions";

type Action = (
  prev: CategoryFormState,
  formData: FormData,
) => Promise<CategoryFormState>;

export function CategoryForm({
  action,
  initial,
}: {
  action: Action;
  initial?: { name: string; slug: string };
}) {
  const [state, formAction] = useActionState<CategoryFormState, FormData>(
    action,
    undefined,
  );

  return (
    <form action={formAction} className="space-y-5 max-w-md">
      <Field label="Name" htmlFor="name">
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={initial?.name}
          className={inputCx}
          placeholder="e.g. Wedding cakes"
        />
      </Field>
      <Field
        label="Slug"
        htmlFor="slug"
        hint="Leave blank to generate from the name (e.g. wedding-cakes)."
      >
        <input
          id="slug"
          name="slug"
          type="text"
          defaultValue={initial?.slug}
          className={inputCx}
          placeholder="auto"
        />
      </Field>

      {state?.error && (
        <p role="alert" className="text-rose-deep text-sm">
          {state.error}
        </p>
      )}

      <SubmitButton>Save category</SubmitButton>
    </form>
  );
}
