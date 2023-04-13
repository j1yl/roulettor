import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Poppins } from "next/font/google";

const pop = Poppins({
  weight: "400",
  subsets: ["latin"],
});

import "~/styles/globals.css";
import Navbar from "~/components/Navbar";
import { UserStateProvider } from "~/context/UserContext";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <div className={pop.className}>
      <SessionProvider session={session}>
        <UserStateProvider>
          <Navbar />
          <Component {...pageProps} />
        </UserStateProvider>
      </SessionProvider>
    </div>
  );
};

export default MyApp;
