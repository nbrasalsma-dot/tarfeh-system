import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      tenantId?: string;
    } & DefaultSession["user"];
  }

  interface User {
    tenantId?: string;
  }
}
