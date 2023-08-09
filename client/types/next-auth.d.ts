import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      userId: number;
      balance: number;
    } & DefaultSession["user"];
  }
  interface User {
    userId: number;
    balance: number;
  }
}
