import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import "~/styles/globals.css";
import Navbar from "~/components/Navbar";

import { GameStateProvider } from "~/context/GameStateContext";

import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    const socket = io("http://localhost:3000", {
      path: "/api/socket",
      autoConnect: false,
    });
    socket.connect();
    console.log(socket.active, socket.hasListeners("connect"));

    socket.on("connect", () => {
      console.log(`SOCKET CONNECTED - ${socket.id}`);
      setConnected(true);
    });
  }, []);

  return (
    <SessionProvider session={session}>
      <GameStateProvider>
        <Navbar />
        {connected ? (
          <div>
            <h1>Connected</h1>
          </div>
        ) : (
          <div>
            <h1>No Connection Found</h1>
          </div>
        )}
        <Component {...pageProps} />
      </GameStateProvider>
    </SessionProvider>
  );
};

export default MyApp;
