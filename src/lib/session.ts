import { SignJWT, jwtVerify } from "jose";

// Pure session crypto — NO `server-only`, NO next/headers — so this module can
// be imported by both server code (via the DAL) and proxy.ts (edge-style req
// handling). Cookie reading/writing lives in the DAL (@/lib/dal).

export const SESSION_COOKIE = "petalcrumb_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days, in seconds

export type SessionPayload = {
  adminId: string;
  email: string;
  name: string;
};

function key() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export async function encryptSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key());
}

export async function decryptSession(
  token: string | undefined,
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key(), {
      algorithms: ["HS256"],
    });
    const { adminId, email, name } = payload as Record<string, unknown>;
    if (
      typeof adminId === "string" &&
      typeof email === "string" &&
      typeof name === "string"
    ) {
      return { adminId, email, name };
    }
    return null;
  } catch {
    // Expired or tampered token
    return null;
  }
}
