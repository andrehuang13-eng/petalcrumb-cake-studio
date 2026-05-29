"use client";

import { useActionState } from "react";
import { Field, inputCx } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/submit-button";
import type { FaqFormState } from "./actions";

type Action = (prev: FaqFormState, formData: FormData) => Promise<FaqFormState>;

export function FaqForm({
  action,
  initial,
}: {
  action: Action;
  initial?: { question: string; answer: string; sortOrder: number };
}) {
  const [state, formAction] = useActionState<FaqFormState, FormData>(
    action,
    undefined,
  );

  return (
    <form action={formAction} className="space-y-5 max-w-2xl">
      <Field label="Question" htmlFor="question">
        <input
          id="question"
          name="question"
          type="text"
          required
          defaultValue={initial?.question}
          className={inputCx}
          placeholder="e.g. How far in advance should I order?"
        />
      </Field>
      <Field label="Answer" htmlFor="answer">
        <textarea
          id="answer"
          name="answer"
          rows={5}
          required
          defaultValue={initial?.answer}
          className={`${inputCx} resize-y`}
        />
      </Field>
      <Field
        label="Sort order"
        htmlFor="sortOrder"
        hint="Lower numbers appear first."
      >
        <input
          id="sortOrder"
          name="sortOrder"
          type="number"
          min={0}
          defaultValue={initial?.sortOrder ?? 0}
          className={`${inputCx} max-w-[8rem]`}
        />
      </Field>

      {state?.error && (
        <p role="alert" className="text-rose-deep text-sm">
          {state.error}
        </p>
      )}

      <SubmitButton>Save FAQ</SubmitButton>
    </form>
  );
}
