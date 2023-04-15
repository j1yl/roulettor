import React from "react";
import { useSession } from "next-auth/react";
import RouletteSpinner from "./RouletteSpinner";
import StatusBar from "./StatusBar";
import RouletteBetting from "./RouletteBetting";

const Roulette = () => {
  const { data: session } = useSession();
  if (!session) return <p>SIGN IN TO PLAY</p>;

  return (
    <section className="mt-16 flex w-full max-w-screen-xl flex-col gap-8 p-4">
      <RouletteSpinner />
      <StatusBar totalTimeInSeconds={60} />
      <RouletteBetting />
    </section>
  );
};

export default Roulette;
