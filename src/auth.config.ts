import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname === "/";
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // يرجعه للوجن إذا مش مسجل دخول
      }
      return true;
    },
  },
  providers: [], // بنضيف البروفايدر في ملف auth.ts الرئيسي
} satisfies NextAuthConfig;
