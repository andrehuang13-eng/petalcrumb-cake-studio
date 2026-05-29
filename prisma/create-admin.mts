// Create or update the single studio admin.
// Usage (PowerShell):
//   $env:ADMIN_EMAIL="you@example.com"; $env:ADMIN_PASSWORD="…"; npm run db:create-admin
// Re-running with the same email updates the password (handy for resets).

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Load .env (for DATABASE_URL) when run via `tsx`. ADMIN_* still come from the
// shell. Node 20.12+ / 24 built-in; safe to ignore if .env is absent.
try {
  process.loadEnvFile();
} catch {
  /* .env optional — DATABASE_URL may already be in the environment */
}

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME ?? "Studio Admin";

if (!email || !password) {
  console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD environment variables.");
  process.exit(1);
}

const prisma = new PrismaClient();

const passwordHash = await bcrypt.hash(password, 12);
const admin = await prisma.admin.upsert({
  where: { email: email.toLowerCase() },
  update: { passwordHash, name },
  create: { email: email.toLowerCase(), passwordHash, name },
});

console.log(`Admin ready: ${admin.email} (${admin.name})`);
await prisma.$disconnect();
