import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

function splitGoogleName(googleUser) {
  const fallback = (googleUser.name || googleUser.email?.split("@")[0] || "").trim();
  const [firstFromName = "", ...lastFromName] = fallback.split(/\s+/);

  return {
    firstName: googleUser.given_name || firstFromName || "Traveler",
    lastName: googleUser.family_name || lastFromName.join(" ") || "",
  };
}

async function findOrCreateGoogleUser(googleUser) {
  if (!prisma || !googleUser?.email) return null;

  const { firstName, lastName } = splitGoogleName(googleUser);
  const displayName = googleUser.name || [firstName, lastName].filter(Boolean).join(" ");

  const existingUser = await prisma.user.findUnique({
    where: { email: googleUser.email },
  });

  if (!existingUser) {
    return prisma.user.create({
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
  }

  return prisma.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: existingUser.emailVerified || new Date(),
      image: googleUser.picture || existingUser.image,
      name: googleUser.name || existingUser.name,
      first_name: existingUser.first_name || firstName,
      last_name: existingUser.last_name || lastName,
    },
  });
}

async function linkGoogleAccount(userId, googleId, accountData = {}) {
  if (!prisma || !userId || !googleId) return;

  const existingAccount = await prisma.account.findFirst({
    where: {
      provider: "google",
      providerAccountId: googleId,
    },
  });

  if (existingAccount) return;

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
      clientId: process.env.GOOGLE_CLIENT_ID || "",
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
      },
      async authorize(credentials) {
        if (!credentials?.id_token) return null;

        try {
          const response = await fetch(
            `https://oauth2.googleapis.com/tokeninfo?id_token=${credentials.id_token}`
          );

          if (!response.ok) {
            console.error("[AUTH] Google token verification failed");
            return null;
          }

          const googleUser = await response.json();

          if (googleUser.aud !== process.env.GOOGLE_CLIENT_ID) {
            console.error("[AUTH] Google token audience mismatch");
            return null;
          }

          const user = await findOrCreateGoogleUser(googleUser);
          if (!user) return null;

          await linkGoogleAccount(user.id, googleUser.sub, {
            id_token: credentials.id_token,
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
          console.error("[AUTH] google-id-token authorize error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const googleUser = {
            email: user.email,
            name: user.name,
            picture: user.image,
            given_name: profile?.given_name,
            family_name: profile?.family_name,
          };
          const dbUser = await findOrCreateGoogleUser(googleUser);
          if (dbUser) {
            user.id = dbUser.id;
            user.role = "user";
            await linkGoogleAccount(dbUser.id, account.providerAccountId, account);
          }
        } catch (error) {
          console.error("[AUTH] Google account linking error:", error);
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
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
