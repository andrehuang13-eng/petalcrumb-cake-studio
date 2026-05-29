import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  decryptSession,
  encryptSession,
  type SessionPayload,
} from "@/lib/session";

// Data Access Layer for auth. Centralizes session read/write so every admin
// surface (layout, pages, server actions) checks the same way.

export async function createSession(payload: SessionPayload): Promise<void> {
  const token = await encryptSession(payload);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function destroySession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}

// Memoized per render pass so multiple callers don't re-decrypt.
export const getSession = cache(async (): Promise<SessionPayload | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return decryptSession(token);
});

// Authoritative gate for admin server code. Redirects when unauthenticated.
export const requireAdmin = cache(async (): Promise<SessionPayload> => {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
});
