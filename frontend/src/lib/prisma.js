import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis;

function normalizeDbUrl(value) {
  if (!value) return null;
  return String(value).trim().replace(/^["']|["']$/g, "");
}

function isValidPostgresUrl(value) {
  const normalized = normalizeDbUrl(value);
  if (!normalized) return false;

  try {
    const parsed = new URL(normalized);
    return (
      ["postgresql:", "postgres:"].includes(parsed.protocol) &&
      Boolean(parsed.hostname) &&
      Boolean(parsed.username) &&
      parsed.pathname.length > 1
    );
  } catch (_) {
    return false;
  }
}

function getDbUrl() {
  const candidates = [
    process.env.DATABASE_URL,
    process.env.DATABASE_URL_NEON,
    process.env.DIRECT_URL,
    process.env.POSTGRES_PRISMA_URL,
    process.env.POSTGRES_URL,
    process.env.POSTGRES_URL_NON_POOLING,
    process.env.NEON_DATABASE_URL,
    process.env.NEON_DATABASE_URL_POOLED,
  ];

  for (const candidate of candidates) {
    const normalized = normalizeDbUrl(candidate);
    if (isValidPostgresUrl(normalized)) {
      return normalized;
    }
  }

  throw new Error(
    "No valid PostgreSQL connection string found. Set DATABASE_URL, DATABASE_URL_NEON, POSTGRES_PRISMA_URL, POSTGRES_URL, DIRECT_URL, or a Neon database URL in Vercel."
  );
}

export function getPrismaConnectionSummary() {
  try {
    const url = new URL(getDbUrl());
    return {
      configured: true,
      host: url.hostname,
      database: url.pathname.replace(/^\//, ""),
      source: [
        "DATABASE_URL",
        "DATABASE_URL_NEON",
        "DIRECT_URL",
        "POSTGRES_PRISMA_URL",
        "POSTGRES_URL",
        "POSTGRES_URL_NON_POOLING",
        "NEON_DATABASE_URL",
        "NEON_DATABASE_URL_POOLED",
      ].find((key) => isValidPostgresUrl(process.env[key])) || "runtime_env",
    };
  } catch (error) {
    return {
      configured: false,
      error: error.message,
    };
  }
}

/** @type {PrismaClient} */
let prisma;

if (process.env.NEXT_PHASE === "phase-production-build") {
  prisma = null;
} else {
  if (!globalForPrisma.prisma) {
    const connectionString = getDbUrl();
    process.env.DATABASE_URL = connectionString;
    const adapter = new PrismaPg(connectionString);

    globalForPrisma.prisma = new PrismaClient({ adapter });
  }
  prisma = globalForPrisma.prisma;
}

export default prisma;
