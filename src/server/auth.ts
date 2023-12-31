import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials";

import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
import type { UserModelType } from "~/utils/z.types";
import { TRPCError } from "@trpc/server";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    // user: DefaultSession["user"] & {
    //   id: string;
    //   // ...other properties
    //   // role: UserRole;
    // };
    // user: DefaultSession["user"]
    user: DefaultSession["user"] & UserModelType
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt"
  },
  callbacks: {
    session: ({ session, user, token }) => ({
      ...session,
      // user: {
      //   ...session.user,
      //   id: user.id,
      // },
      token: { ...token }
    }),
    jwt: ({ token, account, profile }) => {
      if (account) {
        token = { ...token, ...account }
      }
      if (profile) {
        token = { ...token, ...profile }
      }
      return token

    },
    signIn: ({ user, account, profile }) => {
      try {
        console.info('signIn callback => USER:', { user })
        if (user) return '/'
        return false

      } catch (error) {
        console.warn("signIn callback => ERROR:", { error })
        return false
      }
    }
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    // DiscordProvider({
    //   clientId: env.DISCORD_CLIENT_ID,
    //   clientSecret: env.DISCORD_CLIENT_SECRET,
    // }),
    CredentialsProvider({
      id: 'unique-id',
      name: 'Credentials',
      type: "credentials",
      credentials: {
        username: { label: 'usuario', type: 'text' },
        password: { label: 'contraseña', type: 'password' }
      },
      async authorize(credentials) {
        const username = credentials?.username
        if (!username) throw new TRPCError({ code: "NOT_FOUND", message: 'username must be provided' })

        const user = await prisma.user.findUnique({ where: { username } })
        if (!user) throw new TRPCError({ code: "NOT_FOUND" })
        return user
      }

    })
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
