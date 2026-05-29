import { OrderRequestStatus } from "@prisma/client";

// Display order for filters/selects, and badge tone per status.
export const STATUS_ORDER: OrderRequestStatus[] = [
  "NEW",
  "CONTACTED",
  "QUOTED",
  "CONFIRMED",
  "COMPLETED",
  "DECLINED",
];

export const STATUS_TONE: Record<OrderRequestStatus, string> = {
  NEW: "rose",
  CONTACTED: "gold",
  QUOTED: "gold",
  CONFIRMED: "sage",
  COMPLETED: "sage",
  DECLINED: "mute",
};

export function titleCase(s: string): string {
  return s.charAt(0) + s.slice(1).toLowerCase();
}
