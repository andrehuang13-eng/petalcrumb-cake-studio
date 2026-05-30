"use server";

import { cookies } from "next/headers";
import { THEME_COOKIE, type Theme } from "@/lib/theme";

const ONE_YEAR = 60 * 60 * 24 * 365;

// Server action wired from <ThemeToggle>. The toggle also flips the class
// optimistically on the client so the user sees the change instantly; this
// just persists the choice so future SSRs render the same theme.
export async function setTheme(next: Theme): Promise<void> {
  (await cookies()).set(THEME_COOKIE, next, {
    httpOnly: false, // accessible to JS; not sensitive
    sameSite: "lax",
    maxAge: ONE_YEAR,
    path: "/",
  });
}
