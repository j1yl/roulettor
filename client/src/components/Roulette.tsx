import React from "react";
import RouletteSpinner from "./RouletteSpinner";
import StatusBar from "./StatusBar";
import RoulettePanel from "./RoulettePanel";

interface Props {
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
}

const Roulette = (props: Props) => {
  return (
    <section className="mt-16 flex w-full max-w-screen-xl flex-col gap-8 p-4">
      <RouletteSpinner />
      <StatusBar totalTimeInSeconds={60} />
      <RoulettePanel balance={props.balance} setBalance={props.setBalance} />
    </section>
  );
};

export default Roulette;
