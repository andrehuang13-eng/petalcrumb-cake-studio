import { PrismaClient } from "@prisma/client";

// Use a singleton Prisma client in development to avoid exhausting
// connections during Next.js hot reload (which re-imports modules).
// In production each serverless invocation creates its own client.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
