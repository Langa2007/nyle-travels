import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const DEFAULT_GOOGLE_CLIENT_ID =
  "766373716111-naoh8vma3on54nnhtlolhr2orae6q14v.apps.googleusercontent.com";

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  process.env.GOOGLE_CLIENT_ID ||
  DEFAULT_GOOGLE_CLIENT_ID;

const ALLOWED_GOOGLE_CLIENT_IDS = new Set(
  [
    process.env.GOOGLE_CLIENT_ID,
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    DEFAULT_GOOGLE_CLIENT_ID,
  ].filter(Boolean)
);

function createServerTraceId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function maskEmail(email) {
  if (!email || typeof email !== "string") return undefined;

  const [name, domain] = email.split("@");
  if (!domain) return "[invalid-email]";

  const visible = name.slice(0, 2);
  return `${visible}${"*".repeat(Math.max(name.length - visible.length, 1))}@${domain}`;
}

function safeError(error) {
  if (!error) return undefined;

  if (typeof error === "object" && !(error instanceof Error)) {
    return sanitizeForAuthLog(error);
  }

  return {
    name: error.name,
    message: error.message || String(error),
    code: error.code,
    meta: error.meta,
  };
}

function sanitizeForAuthLog(input) {
  if (!input || typeof input !== "object") return input;

  if (Array.isArray(input)) {
    return input.map((item) => sanitizeForAuthLog(item));
  }

  return Object.fromEntries(
    Object.entries(input).map(([key, value]) => {
      const normalizedKey = key.toLowerCase();

      if (
        normalizedKey.includes("token") ||
        normalizedKey.includes("credential") ||
        normalizedKey.includes("secret") ||
        normalizedKey.includes("password")
      ) {
        return [key, "[redacted]"];
      }

      if (normalizedKey.includes("email") && typeof value === "string") {
        return [key, maskEmail(value)];
      }

      if (value && typeof value === "object") {
        return [key, sanitizeForAuthLog(value)];
      }

      return [key, value];
    })
  );
}

function authLog(stage, details = {}) {
  console.info("[AUTH_DIAGNOSTIC_SERVER]", {
    stage,
    at: new Date().toISOString(),
    ...sanitizeForAuthLog(details),
  });
}

function authWarn(stage, details = {}) {
  console.warn("[AUTH_DIAGNOSTIC_SERVER]", {
    stage,
    at: new Date().toISOString(),
    ...sanitizeForAuthLog(details),
  });
}

function authError(stage, error, details = {}) {
  console.error("[AUTH_DIAGNOSTIC_SERVER]", {
    stage,
    at: new Date().toISOString(),
    ...sanitizeForAuthLog(details),
    error: safeError(error),
  });
}

function summarizeGoogleUser(googleUser) {
  if (!googleUser) return null;

  return {
    subPresent: Boolean(googleUser.sub),
    aud: googleUser.aud,
    email: maskEmail(googleUser.email),
    emailVerified: googleUser.email_verified,
    hostedDomain: googleUser.hd,
    expiresAt: googleUser.exp,
    issuedAt: googleUser.iat,
  };
}

function splitGoogleName(googleUser) {
  const fallback = (googleUser.name || googleUser.email?.split("@")[0] || "").trim();
  const [firstFromName = "", ...lastFromName] = fallback.split(/\s+/);

  return {
    firstName: googleUser.given_name || firstFromName || "Traveler",
    lastName: googleUser.family_name || lastFromName.join(" ") || "",
  };
}

async function findOrCreateGoogleUser(googleUser, traceId) {
  if (!prisma) {
    authWarn("google_user_prisma_unavailable", { traceId });
    return null;
  }

  if (!googleUser?.email) {
    authWarn("google_user_missing_email", { traceId, googleUser: summarizeGoogleUser(googleUser) });
    return null;
  }

  const { firstName, lastName } = splitGoogleName(googleUser);
  const displayName = googleUser.name || [firstName, lastName].filter(Boolean).join(" ");

  authLog("google_user_lookup_started", {
    traceId,
    email: maskEmail(googleUser.email),
  });

  const existingUser = await prisma.user.findUnique({
    where: { email: googleUser.email },
  });

  if (!existingUser) {
    const createdUser = await prisma.user.create({
      data: {
        email: googleUser.email,
        name: displayName,
        first_name: firstName,
        last_name: lastName,
        image: googleUser.picture,
        emailVerified: new Date(),
        role: "user",
      },
    });

    authLog("google_user_created", {
      traceId,
      userId: createdUser.id,
      email: maskEmail(createdUser.email),
    });

    return createdUser;
  }

  const updatedUser = await prisma.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: existingUser.emailVerified || new Date(),
      image: googleUser.picture || existingUser.image,
      name: googleUser.name || existingUser.name,
      first_name: existingUser.first_name || firstName,
      last_name: existingUser.last_name || lastName,
    },
  });

  authLog("google_user_updated", {
    traceId,
    userId: updatedUser.id,
    email: maskEmail(updatedUser.email),
  });

  return updatedUser;
}

async function linkGoogleAccount(userId, googleId, accountData = {}, traceId) {
  if (!prisma || !userId || !googleId) {
    authWarn("google_account_link_skipped", {
      traceId,
      hasPrisma: Boolean(prisma),
      hasUserId: Boolean(userId),
      hasGoogleId: Boolean(googleId),
    });
    return;
  }

  const existingAccount = await prisma.account.findFirst({
    where: {
      provider: "google",
      providerAccountId: googleId,
    },
  });

  if (existingAccount) {
    authLog("google_account_link_exists", {
      traceId,
      userId,
      accountId: existingAccount.id,
    });
    return;
  }

  await prisma.account.create({
    data: {
      userId,
      type: accountData.type || "oauth",
      provider: "google",
      providerAccountId: googleId,
      access_token: accountData.access_token,
      refresh_token: accountData.refresh_token,
      expires_at: accountData.expires_at,
      token_type: accountData.token_type,
      scope: accountData.scope,
      id_token: accountData.id_token,
      session_state: accountData.session_state,
    },
  });

  authLog("google_account_link_created", { traceId, userId });
}

export const authOptions = {
  get adapter() {
    if (process.env.NEXT_PHASE === "phase-production-build" || !prisma) {
      return undefined;
    }
    return PrismaAdapter(prisma);
  },
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !prisma) return null;

        const bcrypt = await import("bcryptjs");
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password_hash) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password_hash);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name || `${user.first_name} ${user.last_name}`.trim(),
          image: user.image,
          role: user.role || "user",
          emailVerified: user.emailVerified,
        };
      },
    }),
    CredentialsProvider({
      id: "google-id-token",
      name: "Google ID Token",
      credentials: {
        id_token: { label: "ID Token", type: "text" },
        trace_id: { label: "Trace ID", type: "text" },
      },
      async authorize(credentials) {
        const traceId = credentials?.trace_id || createServerTraceId();

        authLog("google_id_token_authorize_started", {
          traceId,
          hasToken: Boolean(credentials?.id_token),
          allowedAudiences: Array.from(ALLOWED_GOOGLE_CLIENT_IDS),
          hasDatabaseUrl: Boolean(process.env.DATABASE_URL || process.env.DATABASE_URL_NEON),
          hasNextAuthSecret: Boolean(process.env.NEXTAUTH_SECRET),
          hasJwtSecret: Boolean(process.env.JWT_SECRET),
        });

        if (!credentials?.id_token) {
          authWarn("google_id_token_missing", { traceId });
          return null;
        }

        try {
          const response = await fetch(
            `https://oauth2.googleapis.com/tokeninfo?id_token=${credentials.id_token}`
          );

          if (!response.ok) {
            let verificationBody = "";
            try {
              verificationBody = await response.text();
            } catch (_) {}

            authWarn("google_token_verification_failed", {
              traceId,
              status: response.status,
              statusText: response.statusText,
              response: verificationBody.slice(0, 300),
            });
            return null;
          }

          const googleUser = await response.json();

          authLog("google_token_verified", {
            traceId,
            googleUser: summarizeGoogleUser(googleUser),
          });

          if (!ALLOWED_GOOGLE_CLIENT_IDS.has(googleUser.aud)) {
            authWarn("google_token_audience_mismatch", {
              traceId,
              expected: Array.from(ALLOWED_GOOGLE_CLIENT_IDS),
              received: googleUser.aud,
            });
            return null;
          }

          const user = await findOrCreateGoogleUser(googleUser, traceId);
          if (!user) {
            authWarn("google_user_resolution_failed", {
              traceId,
              googleUser: summarizeGoogleUser(googleUser),
            });
            return null;
          }

          await linkGoogleAccount(user.id, googleUser.sub, {
            id_token: credentials.id_token,
          }, traceId);

          authLog("google_id_token_authorize_succeeded", {
            traceId,
            userId: user.id,
            email: maskEmail(user.email),
          });

          return {
            id: user.id,
            email: user.email,
            name: googleUser.name || user.name,
            image: googleUser.picture || user.image,
            role: "user",
            emailVerified: user.emailVerified,
          };
        } catch (error) {
          authError("google_id_token_authorize_error", error, { traceId });
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      authLog("sign_in_callback_started", {
        provider: account?.provider,
        userId: user?.id,
        email: maskEmail(user?.email),
      });

      if (account?.provider === "google") {
        try {
          const traceId = createServerTraceId();
          const googleUser = {
            email: user.email,
            name: user.name,
            picture: user.image,
            given_name: profile?.given_name,
            family_name: profile?.family_name,
          };
          const dbUser = await findOrCreateGoogleUser(googleUser, traceId);
          if (dbUser) {
            user.id = dbUser.id;
            user.role = "user";
            await linkGoogleAccount(dbUser.id, account.providerAccountId, account, traceId);
          }
        } catch (error) {
          authError("google_oauth_account_linking_error", error, {
            provider: account?.provider,
            email: maskEmail(user?.email),
          });
          return false;
        }
      }

      if (account?.provider === "credentials" && user && !user.emailVerified) {
        throw new Error("Please verify your email address before logging in.");
      }

      return true;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name ?? session.user.name;
        session.user.image = token.picture ?? session.user.image;
        session.user.role = token.role ?? "user";
        session.user.emailVerified = token.emailVerified;
        session.accessToken = token.accessToken;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = String(user.id);
        token.email = user.email ?? token.email;
        token.name = user.name;
        token.picture = user.image;
        token.role = user.role ?? "user";
        token.emailVerified = user.emailVerified;
        if (account?.provider) token.provider = account.provider;
      }

      if (!token.accessToken || user) {
        token.accessToken = jwt.sign(
          {
            id: token.id,
            email: token.email,
            role: token.role || "user",
          },
          process.env.JWT_SECRET || "secret-key",
          { expiresIn: "7d" }
        );
      }

      return token;
    },
  },
  logger: {
    error(code, metadata) {
      authError("nextauth_logger_error", metadata, { code });
    },
    warn(code) {
      authWarn("nextauth_logger_warn", { code });
    },
    debug(code, metadata) {
      authLog("nextauth_logger_debug", { code, metadata });
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
