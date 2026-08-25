import "@/lib/biginit-polyfill";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient, Prisma  } from "../../prisma/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const connectionString = process.env.DATABASE_URL;

function createPrismaClient(): PrismaClient {
  const pool = new Pool({
    connectionString:
        connectionString ?? "postgresql://user:password@localhost:5432/ovjtc",
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export { Prisma };
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export type JobUpdateData = Parameters<typeof prisma.job.update>[0]["data"];