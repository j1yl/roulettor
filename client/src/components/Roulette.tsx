import React from "react";
import RouletteSpinner from "./RouletteSpinner";
import RoulettePanel from "./RoulettePanel";
import StatusBar from "./StatusBar";

const Roulette = () => {
  return (
    <section className="mt-16 flex w-full max-w-screen-xl flex-col gap-8 p-4">
      <RouletteSpinner />
      <StatusBar totalTimeInSeconds={60} />
      <RoulettePanel />
    </section>
  );
};

export default Roulette;
