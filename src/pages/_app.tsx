import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import "~/styles/globals.css";
import Navbar from "~/components/Navbar";
import { GameStateProvider } from "~/context/GameStateContext";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <GameStateProvider>
        <Navbar />
        <Component {...pageProps} />
      </GameStateProvider>
    </SessionProvider>
  );
};

export default MyApp;
