// lib/db-error.ts
const DB_CONNECTION_ERROR_CODES = new Set([
    "ETIMEDOUT",
    "ECONNREFUSED",
    "ENOTFOUND",
    "EHOSTUNREACH",
    "EAI_AGAIN",
    "P1001", // Prisma: Can't reach database server
    "P1002", // Prisma: Database server timed out
    "P1008", // Prisma: Operations timed out
    "P1017", // Prisma: Server closed the connection
]);

export function isDatabaseConnectionError(error: unknown): boolean {
    if (!error || typeof error !== "object") return false;
    const err = error as { code?: string; name?: string };
    if (err.code && DB_CONNECTION_ERROR_CODES.has(err.code)) return true;
    if (err.name === "PrismaClientInitializationError") return true;
    return false;
}