import { z } from "zod";

// Single source of truth for the order-request form.
// Used by:
//  - the client form (via @hookform/resolvers/zod) for inline validation
//  - the server action for re-validation before DB write
// Keeps client and server perfectly in sync.

export const occasionOptions = [
  "Birthday",
  "Wedding",
  "Anniversary",
  "Christening",
  "Corporate event",
  "Other",
] as const;

export const budgetOptions = [
  "Under £100",
  "£100–250",
  "£250–500",
  "£500–1000",
  "£1000+",
  "Not sure yet",
] as const;

// Helper: treat empty strings from form inputs as "field omitted" for optional fields.
// (HTML inputs default to "" — not undefined — when left blank.)
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal("").transform(() => undefined));

export const orderRequestSchema = z.object({
  // === Contact ===
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name")
    .max(120, "That looks a bit long — please shorten"),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(200),

  phone: optionalText(40),

  // === Event ===
  // Date arrives as an ISO date string (yyyy-mm-dd) from <input type="date">.
  // We accept the string here and convert to Date in the server action.
  eventDate: z
    .string()
    .min(1, "Please pick a date")
    .refine(
      (s) => {
        const d = new Date(s);
        if (isNaN(d.getTime())) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return d >= today;
      },
      { message: "Event date can't be in the past" },
    ),

  // <input type="number"> sends a string; coerce to number.
  servings: z.coerce
    .number()
    .int("Whole numbers only")
    .min(1, "At least 1 serving")
    .max(1000, "For very large orders, please email us directly"),

  occasion: z.enum(occasionOptions, {
    message: "Please choose an occasion",
  }),

  // === The cake ===
  description: z
    .string()
    .trim()
    .min(20, "Tell us a bit more — at least 20 characters")
    .max(2000, "Please keep it under 2000 characters"),

  allergenNotes: optionalText(500),

  // budgetRange is optional; empty string maps to undefined.
  budgetRange: z
    .enum(budgetOptions)
    .optional()
    .or(z.literal("").transform(() => undefined)),

  // Pre-filled from /cakes/[slug] CTA; not user-editable.
  referenceCakeId: z.string().optional(),

  // --- Anti-spam (not real fields) ---
  // Honeypot: hidden from humans; bots tend to fill it. Must stay empty.
  company: z.string().optional(),
  // Ms the form was on screen before submit; instant submits look automated.
  elapsedMs: z.coerce.number().optional(),
});

export type OrderRequestInput = z.infer<typeof orderRequestSchema>;
