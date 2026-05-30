import "server-only";
import { cookies } from "next/headers";

export const THEME_COOKIE = "petalcrumb_theme";
export type Theme = "light" | "dark";

// Read the user's saved theme. Absent cookie → null (let system preference
// decide via the inline script in layout.tsx). Anything else falls back to
// light to avoid silently dark-flashing a stale value.
export async function getTheme(): Promise<Theme | null> {
  const value = (await cookies()).get(THEME_COOKIE)?.value;
  if (value === "dark" || value === "light") return value;
  return null;
}
