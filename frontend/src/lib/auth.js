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
    CredentialsProvider({
      id: "google-id-token",
      name: "Google ID Token",
      credentials: {
        id_token: { label: "ID Token", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.id_token) return null;

        try {
          // Verify the token with Google
          const response = await fetch(
            `https://oauth2.googleapis.com/tokeninfo?id_token=${credentials.id_token}`
          );
          
          if (!response.ok) {
            console.error('[AUTH] Google token verification failed');
            return null;
          }

          const googleUser = await response.json();
          
          // Verify audience (matches Client ID)
          if (googleUser.aud !== process.env.GOOGLE_CLIENT_ID) {
            console.error('[AUTH] Google token audience mismatch');
            return null;
          }

          const email = googleUser.email;
          const name = googleUser.name;
          const image = googleUser.picture;
          const googleId = googleUser.sub;

          if (!prisma) {
             const { default: p } = await import("@/lib/prisma"); 
          }

          // Find or create user
          let user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            // Create new user if not exists
            user = await prisma.user.create({
              data: {
                email,
                name: name || email.split('@')[0],
                first_name: googleUser.given_name || "",
                last_name: googleUser.family_name || "",
                image,
                emailVerified: new Date(),
                role: 'USER',
              },
            });
          }

          // Link account if not already linked
          const existingAccount = await prisma.account.findFirst({
            where: {
              provider: "google",
              providerAccountId: googleId,
            },
          });

          if (!existingAccount) {
            await prisma.account.create({
              data: {
                userId: user.id,
                type: "oauth",
                provider: "google",
                providerAccountId: googleId,
                id_token: credentials.id_token,
              },
            });
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error('[AUTH] google-id-token authorize error:', error);
          return null;
        }
      },
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
