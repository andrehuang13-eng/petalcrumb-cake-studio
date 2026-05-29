"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession } from "@/lib/dal";
import { loginSchema } from "@/lib/validators/auth";

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
