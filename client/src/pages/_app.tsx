import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Source_Sans_Pro } from "next/font/google";

const ssp = Source_Sans_Pro({
  weight: "400",
  subsets: ["latin"],
});

import "~/styles/globals.css";
import Navbar from "~/components/Navbar";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <div className="h-full w-full">
      <div className={ssp.className}>
        <div className="mx-auto max-w-6xl">
          <SessionProvider session={session}>
            <Navbar />
            <Component {...pageProps} />
          </SessionProvider>
        </div>
      </div>
    </div>
  );
};

export default MyApp;
