"use server";

import { prisma } from "@/lib/prisma";
import { sendOrderRequestEmail } from "@/lib/email";
import {
  orderRequestSchema,
  type OrderRequestInput,
} from "@/lib/validators/orderRequest";
import { rateLimit, clientKey } from "@/lib/rate-limit";

export type SubmitResult = { ok: true } | { ok: false; error: string };

/**
 * Server action invoked by the order-request form on submit.
 *
 * Flow:
 *   1. Re-validate with Zod (never trust client validation alone).
 *   2. Persist to `order_requests`. This is the source of truth.
 *   3. Await the notification email, then return. We must await it: on a
 *      serverless host (Vercel) any work not awaited before the response is
 *      killed when the function freezes, so a fire-and-forget send never
 *      actually delivers. Email failure does not fail the request — the DB
 *      record is already saved — so the error is swallowed and logged.
 */
export async function submitOrderRequest(
  raw: OrderRequestInput,
): Promise<SubmitResult> {
  const parsed = orderRequestSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Some fields are not quite right. Please check and try again.",
    };
  }

  const data = parsed.data;

  // --- Anti-spam ---
  // Honeypot filled, or an implausibly fast submit → silently accept so bots
  // don't learn, but drop it: no DB write, no email.
  if (data.company && data.company.trim() !== "") return { ok: true };
  if (typeof data.elapsedMs === "number" && data.elapsedMs < 2500) {
    return { ok: true };
  }

  // Best-effort per-IP rate limit: 5 submissions per 10 minutes.
  if (!rateLimit(await clientKey("order"), 5, 10 * 60_000)) {
    return {
      ok: false,
      error:
        "You've sent several requests recently — please try again in a little while.",
    };
  }

  try {
    const created = await prisma.orderRequest.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone ?? null,
        eventDate: new Date(data.eventDate),
        servings: data.servings,
        occasion: data.occasion,
        description: data.description,
        allergenNotes: data.allergenNotes ?? null,
        budgetRange: data.budgetRange ?? null,
        // Empty string from the hidden input → null in DB.
        referenceCakeId: data.referenceCakeId ? data.referenceCakeId : null,
      },
      include: {
        referenceCake: { select: { title: true, slug: true } },
      },
    });

    // Send the notification email. Awaited (see docstring) so it completes
    // before the serverless function freezes. Email is best-effort: the DB
    // record is the source of truth and an admin can also see new requests in
    // the dashboard (M5/M6), so a send failure is logged, never surfaced.
    try {
      const emailResult = await sendOrderRequestEmail({
        id: created.id,
        name: created.name,
        email: created.email,
        phone: created.phone,
        eventDate: created.eventDate,
        servings: created.servings,
        occasion: created.occasion,
        description: created.description,
        allergenNotes: created.allergenNotes,
        budgetRange: created.budgetRange,
        referenceCake: created.referenceCake,
      });
      if (!emailResult.sent) {
        console.warn(
          `[orderRequest ${created.id}] Email not sent: ${emailResult.reason}`,
        );
      }
    } catch (err) {
      console.error(`[orderRequest ${created.id}] Email send threw:`, err);
    }

    return { ok: true };
  } catch (err) {
    console.error("Failed to save order request:", err);
    return {
      ok: false,
      error:
        "Something went wrong saving your request. Please try again, or email us directly.",
    };
  }
}
