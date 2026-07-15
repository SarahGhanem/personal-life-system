import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  // Explicit because Auth.js v5 only auto-detects `AUTH_SECRET`, not the
  // `NEXTAUTH_SECRET` name used throughout this project's env config.
  secret: process.env.NEXTAUTH_SECRET,
  // Required behind a reverse proxy (Render, etc.) that terminates TLS and
  // forwards the original host — without this, Auth.js rejects the request.
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const path = request.nextUrl.pathname;
      const isPublic = path.startsWith("/login") || path.startsWith("/register");
      if (isPublic) return true;
      return isLoggedIn;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
