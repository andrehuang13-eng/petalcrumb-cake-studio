"use client";

import { useActionState } from "react";
import { Field, inputCx } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/submit-button";
import { updateSettings, type SettingsFormState } from "./actions";

type Values = {
  email: string;
  phone: string;
  address: string;
  openingHours: string;
  instagramUrl: string;
};

export function SettingsForm({ initial }: { initial: Values }) {
  const [state, formAction] = useActionState<SettingsFormState, FormData>(
    updateSettings,
    undefined,
  );

  return (
    <form action={formAction} className="space-y-5 max-w-xl">
      <Field label="Contact email" htmlFor="email">
        <input id="email" name="email" type="email" required defaultValue={initial.email} className={inputCx} />
      </Field>
      <Field label="Phone" htmlFor="phone">
        <input id="phone" name="phone" type="text" required defaultValue={initial.phone} className={inputCx} />
      </Field>
      <Field label="Address" htmlFor="address" hint="Use commas; rendered across lines on the site.">
        <input id="address" name="address" type="text" required defaultValue={initial.address} className={inputCx} />
      </Field>
      <Field label="Opening hours" htmlFor="openingHours">
        <input id="openingHours" name="openingHours" type="text" required defaultValue={initial.openingHours} className={inputCx} />
      </Field>
      <Field label="Instagram URL" htmlFor="instagramUrl" hint="Full URL, or leave blank.">
        <input id="instagramUrl" name="instagramUrl" type="url" defaultValue={initial.instagramUrl} className={inputCx} placeholder="https://instagram.com/…" />
      </Field>

      {state && "error" in state && state.error && (
        <p role="alert" className="text-rose-deep text-sm">
          {state.error}
        </p>
      )}
      {state && "ok" in state && state.ok && (
        <p className="text-sage text-sm">Saved.</p>
      )}

      <SubmitButton>Save settings</SubmitButton>
    </form>
  );
}
