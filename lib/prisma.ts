import { PrismaClient } from "@prisma/client";

// DATABASE_URL:
// - Supabase: use the CONNECTION-POOLER URL (port 6543, pgbouncer=true) so
//   serverless functions don't exhaust connections, e.g.
//   postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=3
// - If it is missing, Prisma throws "Environment variable not found:
//   DATABASE_URL" on the first query. Set it in .env and in Vercel's project
//   environment variables.

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;