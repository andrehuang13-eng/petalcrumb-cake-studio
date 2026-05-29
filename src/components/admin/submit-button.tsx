"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  pendingText = "Saving…",
  variant = "primary",
}: {
  children: React.ReactNode;
  pendingText?: string;
  variant?: "primary" | "ghost";
}) {
  const { pending } = useFormStatus();
  const base =
    "inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs uppercase tracking-[0.2em] rounded-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed";
  const styles =
    variant === "primary"
      ? "bg-ink text-cream hover:bg-rose-deep"
      : "border border-line text-ink-soft hover:border-ink hover:text-ink";
  return (
    <button type="submit" disabled={pending} className={`${base} ${styles}`}>
      {pending ? pendingText : children}
    </button>
  );
}
