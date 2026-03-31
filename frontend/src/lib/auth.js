import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const authOptions = {
  // Use a getter to prevent adapter initialization during static analysis/build phase
  get adapter() {
    if (process.env.NEXT_PHASE === 'phase-production-build' || !prisma) {
      return undefined;
    }
    return PrismaAdapter(prisma);
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const bcrypt = await import("bcryptjs");
        
        // Ensure we have a prisma instance (this will only be called at runtime)
        if (!prisma) {
          const { default: p } = await import("@/lib/prisma");
          // Note: prisma is exported as default, but during build it's null.
          // At runtime it will be the real client.
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password_hash) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password_hash);

        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: `${user.first_name} ${user.last_name}`,
          role: user.role,
        };
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        if (!prisma) return true;
        
        try {
          // Check if a user with this email already exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (existingUser) {
            // Check if this Google account is already linked
            const existingAccount = await prisma.account.findFirst({
              where: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            });

            if (!existingAccount) {
              // Link Google account to existing user
              await prisma.account.create({
                data: {
                  userId: existingUser.id,
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  access_token: account.access_token,
                  refresh_token: account.refresh_token,
                  expires_at: account.expires_at,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: account.id_token,
                  session_state: account.session_state,
                },
              });
            }

            // Update user profile with Google info if missing
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                emailVerified: existingUser.emailVerified || new Date(),
                image: existingUser.image || user.image,
                name: existingUser.name || user.name,
              },
            });
          }
        } catch (error) {
          console.error("[AUTH] Google account linking error:", error);
          // Still allow sign-in even if linking fails
        }

        return true;
      }
      
      if (account.provider === "credentials") {
        // If it's a manual login, check if the email is verified
        if (user && !user.emailVerified) {
          throw new Error("Please verify your email address before logging in.");
        }
        return true;
      }
      
      return true;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.emailVerified = token.emailVerified;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.emailVerified = user.emailVerified;
      }
      return token;
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
