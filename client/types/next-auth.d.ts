import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      userId: string;
      balance: number;
    } & DefaultSession["user"];
  }
  interface User {
    userId: string;
    balance: number;
  }
}
