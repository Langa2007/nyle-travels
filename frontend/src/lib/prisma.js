import { PrismaClient } from "@prisma/client";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";

const globalForPrisma = globalThis;

const NEON_POOLER_URL =
  "postgresql://neondb_owner:npg_s9WljCPnZiT8@ep-wild-glade-alswwsa8-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require";

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
    NEON_POOLER_URL,
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
      ].find((key) => isValidPostgresUrl(process.env[key])) || "fallback",
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
    neonConfig.webSocketConstructor = ws;

    const connectionString = getDbUrl();
    const pool = new Pool({ connectionString });
    const adapter = new PrismaNeon(pool);

    globalForPrisma.prisma = new PrismaClient({ adapter });
  }
  prisma = globalForPrisma.prisma;
}

export default prisma;
