"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import {
  orderRequestSchema,
  occasionOptions,
  budgetOptions,
  type OrderRequestInput,
} from "@/lib/validators/orderRequest";
import { submitOrderRequest } from "./actions";

type Props = {
  referenceCake: { id: string; title: string; slug: string } | null;
};

// The schema uses z.coerce (string → number) and z.transform ("" → undefined),
// so its INPUT and OUTPUT types differ. RHF needs both:
//   - FormValues  = what's stored in form state while the user types
//   - OrderRequestInput = what comes back from the resolver after parsing
type FormValues = z.input<typeof orderRequestSchema>;

type FormState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

// Shared input class — bottom-border-only, transparent background.
// Matches the editorial aesthetic established in /gallery and /cakes/[slug].
const inputCx =
  "w-full bg-transparent border-b border-line text-ink font-body text-lg py-3 " +
  "focus:border-ink focus:outline-none transition-colors " +
  "placeholder:text-ink-mute/60";

export function OrderRequestForm({ referenceCake }: Props) {
  const [state, setState] = useState<FormState>({ kind: "idle" });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues, unknown, OrderRequestInput>({
    resolver: zodResolver(orderRequestSchema),
    defaultValues: {
      referenceCakeId: referenceCake?.id,
    },
    // Validate on blur first time, then on every change after.
    // Keeps things calm while typing but still gives quick feedback.
    mode: "onTouched",
  });

  const onSubmit = handleSubmit(async (data) => {
    setState({ kind: "submitting" });
    try {
      const result = await submitOrderRequest(data);
      if (result.ok) {
        setState({ kind: "success" });
        // Scroll the success message into view for clarity.
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setState({ kind: "error", message: result.error });
      }
    } catch {
      setState({
        kind: "error",
        message: "Something went wrong sending your request. Please try again.",
      });
    }
  });

  if (state.kind === "success") {
    return (
      <div className="rounded-sm border border-sage/40 bg-sage/10 px-8 py-10 md:px-10 md:py-12">
        <p className="text-xs tracking-[0.3em] uppercase text-sage mb-4">
          Request received
        </p>
        <h2 className="font-display text-3xl md:text-4xl text-ink mb-5 leading-tight">
          Thank you — we&apos;ll be in touch soon.
        </h2>
        <p className="text-ink-soft leading-relaxed mb-2">
          Your request has landed in our studio inbox. You&apos;ll hear from us
          within two working days with sketches, a price, and next steps.
        </p>
        <p className="text-ink-mute text-sm leading-relaxed">
          Urgent? Email{" "}
          <a
            href="mailto:hello@petalcrumb.co.uk"
            className="text-rose hover:text-rose-deep underline underline-offset-4"
          >
            hello@petalcrumb.co.uk
          </a>{" "}
          and we&apos;ll prioritise.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-12">
      {/* Hidden — passed through from /cakes/[slug] CTA pre-fill. */}
      <input type="hidden" {...register("referenceCakeId")} />

      {/* === About you === */}
      <Fieldset legend="About you">
        <Field label="Full name" error={errors.name?.message}>
          <input type="text" autoComplete="name" {...register("name")} className={inputCx} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input type="email" autoComplete="email" {...register("email")} className={inputCx} />
        </Field>
        <Field label="Phone (optional)" error={errors.phone?.message}>
          <input type="tel" autoComplete="tel" {...register("phone")} className={inputCx} />
        </Field>
      </Fieldset>

      {/* === The event === */}
      <Fieldset legend="The event">
        <Field label="Event date" error={errors.eventDate?.message}>
          <input type="date" {...register("eventDate")} className={inputCx} />
        </Field>
        <Field
          label="Number of servings"
          hint="A rough number is fine — we can adjust later."
          error={errors.servings?.message}
        >
          <input
            type="number"
            inputMode="numeric"
            min={1}
            placeholder="e.g. 30"
            {...register("servings")}
            className={inputCx}
          />
        </Field>
        <Field label="Occasion" error={errors.occasion?.message}>
          <select {...register("occasion")} className={inputCx} defaultValue="">
            <option value="" disabled>
              Choose one…
            </option>
            {occasionOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </Field>
      </Fieldset>

      {/* === The cake === */}
      <Fieldset legend="The cake">
        <Field
          label="What you have in mind"
          hint="Colours, flavours, mood, references — the more the better."
          error={errors.description?.message}
        >
          <textarea
            rows={6}
            placeholder="e.g. Two-tier cake, soft pinks and gold accents, pressed-flower decoration, almond sponge with raspberry filling…"
            {...register("description")}
            className={inputCx + " resize-y min-h-[7rem]"}
          />
        </Field>
        <Field
          label="Allergens or dietary needs (optional)"
          hint="Gluten-free, vegan, nut-free, etc."
          error={errors.allergenNotes?.message}
        >
          <input type="text" {...register("allergenNotes")} className={inputCx} />
        </Field>
        <Field label="Budget range (optional)" error={errors.budgetRange?.message}>
          <select {...register("budgetRange")} className={inputCx} defaultValue="">
            <option value="">Prefer not to say</option>
            {budgetOptions.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </Field>
      </Fieldset>

      {state.kind === "error" && (
        <div
          role="alert"
          className="rounded-sm border border-rose-deep/40 bg-rose/5 px-5 py-4 text-rose-deep text-sm"
        >
          {state.message}
        </div>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={state.kind === "submitting"}
          className="inline-flex items-center gap-3 bg-ink text-cream px-8 py-4 text-xs uppercase tracking-[0.3em] hover:bg-rose-deep transition-colors disabled:opacity-60 disabled:cursor-not-allowed rounded-sm"
        >
          {state.kind === "submitting" ? "Sending…" : "Send request"}
          {state.kind !== "submitting" && <span aria-hidden>→</span>}
        </button>
        <p className="text-ink-mute text-xs mt-4 tracking-wide">
          We reply within two working days. Custom quote, no obligation.
        </p>
      </div>
    </form>
  );
}

// === Small UI helpers — co-located, only used here ===

function Fieldset({
  legend,
  children,
}: {
  legend: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="border-0 p-0 m-0">
      <legend className="text-xs tracking-[0.3em] uppercase text-rose mb-6 pl-0">
        {legend}
      </legend>
      <div className="space-y-7">{children}</div>
    </fieldset>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[0.2em] text-ink-mute mb-2">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p className="text-ink-mute text-xs mt-2 italic">{hint}</p>
      )}
      {error && (
        <p className="text-rose-deep text-xs mt-2 italic" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
