"use client";

import { useActionState } from "react";
import { Field, inputCx } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/submit-button";
import { changePassword, type PasswordState } from "@/app/admin/auth-actions";

export function PasswordForm() {
  const [state, action] = useActionState<PasswordState, FormData>(
    changePassword,
    undefined,
  );

  return (
    <form action={action} className="space-y-5 max-w-md">
      <Field label="Current password" htmlFor="current">
        <input
          id="current"
          name="current"
          type="password"
          autoComplete="current-password"
          required
          className={inputCx}
        />
      </Field>
      <Field label="New password" htmlFor="next" hint="At least 10 characters.">
        <input
          id="next"
          name="next"
          type="password"
          autoComplete="new-password"
          required
          className={inputCx}
        />
      </Field>
      <Field label="Confirm new password" htmlFor="confirm">
        <input
          id="confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          required
          className={inputCx}
        />
      </Field>

      {state && "error" in state && state.error && (
        <p role="alert" className="text-rose-deep text-sm">
          {state.error}
        </p>
      )}
      {state && "ok" in state && state.ok && (
        <p className="text-sage text-sm">Password updated.</p>
      )}

      <SubmitButton>Update password</SubmitButton>
    </form>
  );
}
