import React from "react";
import { useSession } from "next-auth/react";
import RouletteSpinner from "./RouletteSpinner";
import StatusBar from "./StatusBar";

const Roulette = () => {
  const { data: session } = useSession();
  if (!session) return <p>SIGN IN TO PLAY</p>;

  return (
    <section className="my-16 flex w-full max-w-screen-xl flex-col gap-2 p-4">
      <RouletteSpinner />
      <StatusBar totalTimeInSeconds={60} />
      {/* <Spinner /> */}
      {/* <RouletteBetting />
      <RouletteSpinner /> */}
      {/* <RouletteResults /> */}
    </section>
  );
};

export default Roulette;
