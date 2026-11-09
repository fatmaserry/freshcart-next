import NextAuth, { CredentialsSignin, type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { decodeRoutePayload } from "@/lib/auth/routeJwt";
import { api } from "@/lib/api";
import { getErrorMessage } from "@/lib/utils";

// Auth.js only forwards `code` to the client, so the API's message has to travel there.
class InvalidLogin extends CredentialsSignin {
  constructor(message: string) {
    super(message);
    this.code = message;
  }
}

export const authConfig = {
  providers: [
    Credentials({
      name: "freshcart",
      credentials: { email: {}, password: {} },
      authorize: async (credentials) => {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        const payload = await api.auth
          .signIn({ email, password })
          .catch((e: unknown) => {
            throw new InvalidLogin(
              getErrorMessage(e, "Incorrect email or password"),
            );
          });

        const decoded = decodeRoutePayload(payload.token);
        return {
          id: decoded?.id ?? payload.user.email,
          name: payload.user.name,
          email: payload.user.email,
          role: payload.user.role,
          token: payload.token,
        };
      },
    }),
  ],
  pages: { signIn: "/login" },
  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (user) token.user = user as typeof token.user;
      if (trigger === "update" && session && token.user) {
        // useSession().update() from a browser also lands here, so id and role must never be accepted.
        const {
          name,
          email,
          token: routeToken,
        } = session as Partial<typeof token.user>;
        token.user = {
          ...token.user,
          ...(name && { name }),
          ...(email && { email }),
          ...(routeToken && { token: routeToken }),
        };
      }
      const expiresAt = token.user && decodeRoutePayload(token.user.token)?.exp;
      if (expiresAt && expiresAt * 1000 < Date.now()) return null;
      return token;
    },
    // The Route token stays server-side; only profile fields may reach the browser.
    session({ session, token }) {
      if (token.user) {
        const { id, name, email, role } = token.user;
        session.user = { ...session.user, id, name, email, role };
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut, unstable_update } =
  NextAuth(authConfig);
