"use client";

import { useActionState } from "react";
import { login, type LoginState } from "../auth-actions";

const inputCx =
  "w-full bg-transparent border-b border-line text-ink font-body text-lg py-3 " +
  "focus:border-ink focus:outline-none transition-colors placeholder:text-ink-mute/60";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(
    login,
    undefined,
  );

  return (
    <form action={action} className="space-y-7">
      <div>
        <label
          htmlFor="email"
          className="block text-xs uppercase tracking-[0.2em] text-ink-mute mb-2"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className={inputCx}
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-xs uppercase tracking-[0.2em] text-ink-mute mb-2"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputCx}
        />
      </div>

      {state?.error && (
        <p
          role="alert"
          className="rounded-sm border border-rose-deep/40 bg-rose/5 px-4 py-3 text-rose-deep text-sm"
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full inline-flex items-center justify-center gap-2 bg-ink text-cream px-7 py-4 text-xs uppercase tracking-[0.3em] hover:bg-rose-deep transition-colors disabled:opacity-60 disabled:cursor-not-allowed rounded-sm"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
