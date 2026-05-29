"use client";

// A delete control: a tiny form whose `action` is a server action (already
// bound to the target id by the parent). Confirms before submitting.
export function DeleteButton({
  action,
  label = "Delete",
  confirmText = "Delete this? This cannot be undone.",
}: {
  action: () => void | Promise<void>;
  label?: string;
  confirmText?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirmText)) e.preventDefault();
      }}
    >
      <button
        type="submit"
        className="text-xs uppercase tracking-[0.15em] text-ink-mute hover:text-rose-deep transition-colors"
      >
        {label}
      </button>
    </form>
  );
}
