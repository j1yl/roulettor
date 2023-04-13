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
import { GameStateProvider } from "~/context/GameStateContext";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <div className={pop.className}>
      <SessionProvider session={session}>
        <GameStateProvider>
          <UserStateProvider>
            <Navbar />
            <Component {...pageProps} />
          </UserStateProvider>
        </GameStateProvider>
      </SessionProvider>
    </div>
  );
};

export default MyApp;
