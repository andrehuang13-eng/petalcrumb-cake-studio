"use server";

import { prisma } from "@/lib/prisma";
import { sendOrderRequestEmail } from "@/lib/email";
import {
  orderRequestSchema,
  type OrderRequestInput,
} from "@/lib/validators/orderRequest";

export type SubmitResult = { ok: true } | { ok: false; error: string };

/**
 * Server action invoked by the order-request form on submit.
 *
 * Flow:
 *   1. Re-validate with Zod (never trust client validation alone).
 *   2. Persist to `order_requests`. This is the source of truth.
 *   3. Fire-and-forget email notification — log on failure but don't block
 *      the success response, because the DB record is already saved.
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

    // Email is best-effort. The DB record is what matters; admin can also
    // see new requests in the admin dashboard (added in M5/M6).
    sendOrderRequestEmail({
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
    })
      .then((result) => {
        if (!result.sent) {
          console.warn(
            `[orderRequest ${created.id}] Email not sent: ${result.reason}`,
          );
        }
      })
      .catch((err) => {
        console.error(
          `[orderRequest ${created.id}] Email send threw:`,
          err,
        );
      });

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
