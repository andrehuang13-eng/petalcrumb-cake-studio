"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession, getSession } from "@/lib/dal";
import { loginSchema } from "@/lib/validators/auth";
import { rateLimit, clientKey } from "@/lib/rate-limit";

export type LoginState = { error: string } | undefined;

// A valid-format hash to compare against when no admin matches, so a wrong
// email and a wrong password take roughly the same time (avoids trivially
// revealing which emails exist).
const DUMMY_HASH = bcrypt.hashSync("unused-placeholder", 10);

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Please enter a valid email and password." };
  }

  const { email, password } = parsed.data;

  // Best-effort brute-force guard: 8 attempts per 15 minutes per IP.
  if (!rateLimit(await clientKey("login"), 8, 15 * 60_000)) {
    return { error: "Too many attempts. Please try again in a few minutes." };
  }

  const admin = await prisma.admin.findUnique({
    where: { email: email.toLowerCase() },
  });

  const ok = await bcrypt.compare(password, admin?.passwordHash ?? DUMMY_HASH);
  if (!admin || !ok) {
    return { error: "Invalid email or password." };
  }

  await createSession({
    adminId: admin.id,
    email: admin.email,
    name: admin.name,
  });
  // redirect throws internally — must be outside any try/catch
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}

export type PasswordState = { error: string } | { ok: true } | undefined;

// Change the signed-in admin's password. Verifies the current password,
// enforces a minimum length, then stores a fresh bcrypt hash.
export async function changePassword(
  _prev: PasswordState,
  formData: FormData,
): Promise<PasswordState> {
  const session = await getSession();
  if (!session) return { error: "Your session has expired. Please sign in again." };

  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (next.length < 10) {
    return { error: "New password must be at least 10 characters." };
  }
  if (next !== confirm) {
    return { error: "New password and confirmation do not match." };
  }

  const admin = await prisma.admin.findUnique({ where: { id: session.adminId } });
  if (!admin) return { error: "Account not found." };

  const ok = await bcrypt.compare(current, admin.passwordHash);
  if (!ok) return { error: "Current password is incorrect." };

  const passwordHash = await bcrypt.hash(next, 12);
  await prisma.admin.update({
    where: { id: admin.id },
    data: { passwordHash },
  });

  return { ok: true };
}
