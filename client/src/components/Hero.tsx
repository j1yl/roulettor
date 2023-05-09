import React from "react";
import Card from "./Card";

const Hero = () => {
  return (
    <main className="flex p-2">
      <div className="flex max-w-6xl flex-col py-6">
        <h1 className="text-3xl font-bold md:text-5xl">
          Play Casino Games Anytime, Anywhere
        </h1>
        <p className="py-6">
          Love roulette but can&apos;t always make it to the casino? Our
          all-inclusive roulette platform offers fast, seamless gameplay that
          you can enjoy anytime, anywhere.
        </p>
        <div className="divider" />
        <div className="flex flex-col gap-2 rounded-xl md:flex-row">
          <Card
            title="Roulette"
            description="Place a bet to spin the wheel !  "
            image="roulettess.jpg"
            imageAlt="Roulette"
            cta="Play Now"
            ctalink={"/roulette"}
            live={true}
          />
          <Card
            title="Dice"
            description="Coming soon"
            image="placeholder.jpg"
            imageAlt="Dice"
            cta="WIP"
            ctalink={"/"}
            live={false}
          />
          <Card
            title="Coinflip"
            description="Coming soon"
            image="placeholder.jpg"
            imageAlt="Coinflip"
            cta="WIP"
            ctalink={"/"}
            live={false}
          />
        </div>
      </div>
    </main>
  );
};

export default Hero;
