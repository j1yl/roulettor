import type { GetServerSideProps, NextPage } from "next";
import axios from "axios";
import Head from "next/head";

import Roulette from "~/components/Roulette";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface UserResponse {
  data: {
    user: {
      balance: number;
    };
  };
}

const RoulettePage: NextPage = () => {
  const { data: session, status } = useSession();
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    if (session?.user.id) {
      axios
        .get(`http://localhost:3000/api/user/${session.user.id}`)
        .then((res: UserResponse) => {
          setBalance(res.data.user.balance);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [session]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return (
      <>
        <main className="hero min-h-screen">
          <div className="hero-content text-center">
            <div className="max-w-6xl">
              <p className="py-6">Please login to access this page.</p>
              <button onClick={() => signIn()} className="btn-primary btn">
                Login
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Roulettor - Roulette Game</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center">
        <Roulette balance={balance} setBalance={setBalance} />
        <button
          onClick={() => signOut()}
          className="btn-primary btn absolute bottom-20 right-0"
        >
          Logout
        </button>
      </main>
    </>
  );
};

export default RoulettePage;
