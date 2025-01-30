import NextAuth from "next-auth";
import Email from "next-auth/providers/nodemailer";
import Google from "next-auth/providers/google";
import { db } from "@/lib/db";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { sendEmailRequest } from "@/lib/email";
import { Adapter } from "next-auth/adapters";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(db) as Adapter,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    newUser: "/dashboard",
  },
  providers: [
    Google({
      authorization: { params: { access_type: "offline", prompt: "consent" } },
    }),
    Email({
      server: {
        host: "smtp.mailgun.org",
        port: 587,
        auth: {
          user: "postmaster@" + process.env.MAILGUN_DOMAIN,
          pass: process.env.MAILGUN_API_KEY,
        },
      },
      maxAge: 10 * 60,
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        const client = await db;
        const user = await client
          .db()
          .collection("users")
          .findOne({ email: identifier });
        const action = user?.emailVerified ? "SIGNIN" : "ACTIVATE";
        await sendEmailRequest({
          to: identifier,
          action: action,
          variables: { name: identifier, url: url },
        });
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.sub || token.id;
        session.user.name = token.name;
        session.user.email = token.email || "";
        session.user.image = token.picture;
      }

      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session) {
        return { ...token, ...session.user };
      }

      const client = await db;
      const dbUser = await client
        .db()
        .collection("users")
        .findOne({ email: token.email });

      if (!dbUser) {
        if (user && user.id) {
          token.id = user.id;
        }
        return token;
      }

      return {
        id: dbUser._id.toString(),
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        sub: dbUser._id.toString(),
      };
    },
  },
});

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
