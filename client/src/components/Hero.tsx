import Link from "next/link";
import React from "react";

const Hero = () => {
  return (
    <main className="hero min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-6xl">
          <h1 className="text-5xl font-bold">Insert catchy tagline here</h1>
          <p className="py-6">
            Get ready to spin your way to victory with Roulettor - the real-time
            multiplayer roulette game that puts your luck to the test!
          </p>
          <Link href="/roulette" className="btn-primary btn">
            Play Now
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Hero;
