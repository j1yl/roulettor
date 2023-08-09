import NextAuth from "next-auth";
import type { NextAuthOptions, Session, User } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import axios from "axios";

const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
  callbacks: {
    signIn: async (data) => {
      const { user, account, profile } = data;

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user`,
          {
            id: user.id,
            name: user.name,
            email: user.email,
          }
        );

        if (response.data && response.data.id) {
          user.id = response.data.id;
          user.balance = response.data.balance;
        }
      } catch (error) {
        console.error("Error syncing user data with Express server:", error);
      }
      return true;
    },
    session: async (data: { user: User; session: Session }) => {
      const { session } = data;

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
