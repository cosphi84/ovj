import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import {PrismaClient} from "../../prisma/generated/prisma/client";

const globalForPrisma = global as unknown as { prisma: any };

const connectionString = process.env.DATABASE_URL;

let prismaInstance: PrismaClient;

if (!globalForPrisma.prisma) {
  if (connectionString) {
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    prismaInstance = new PrismaClient({ adapter });
  } else {
    // For local development without DATABASE_URL
    const pool = new Pool({ connectionString: "postgresql://user:password@localhost:5432/ovjtc" });
    const adapter = new PrismaPg(pool);
    prismaInstance = new PrismaClient({ adapter });
  }
  globalForPrisma.prisma = prismaInstance;
} else {
  prismaInstance = globalForPrisma.prisma;
}

export const prisma = prismaInstance;
