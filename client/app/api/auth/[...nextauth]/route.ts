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
      const { user } = data;

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user`,
          {
            id: user.id,
            name: user.name,
            email: user.email,
          }
        );

        user.userId = response.data.id;
        user.balance = response.data.balance;
      } catch (error) {
        console.error("Error syncing user data with Express server:", error);
      }

      return true;
    },
    session: async ({ session, token }) => {
      const userId = token.sub;
      session.user.userId = userId as string;

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/${userId}`
        );

        session.user.balance = response.data.balance;
      } catch (error) {
        console.error("Error fetching user data from Express server:", error);
      }

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
