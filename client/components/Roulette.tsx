"use client";

import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

type Props = {
  balance: number;
};

const choiceArray = [0, 11, 5, 10, 6, 9, 7, 8, 1, 14, 2, 13, 3, 12, 4];

const Roulette = (props: Props) => {
  const [betAmount, setBetAmount] = useState(0);
  const [nextGameTime, setNextGameTime] = useState(0);

  const myWheel = useRef<HTMLDivElement>(null);

  const spinWheel = (result: number) => {
    const position = choiceArray.indexOf(result);
    const rows = 12;
    const card = 75 + 8 * 2; // cardwidth * gap * both sides
    const landingPosition = rows * 15 * card + position * card + 340;

    const object = {
      x: Math.floor(Math.random() * 50) / 100,
      y: Math.floor(Math.random() * 20) / 100,
    };
    const resetPosition = -(position * card + 700);

    if (myWheel.current) {
      myWheel.current.style.transitionTimingFunction = `cubic-bezier(0, ${object.x}, ${object.y}, 1)`;
      myWheel.current.style.transitionDuration = "3s";
      myWheel.current.style.transform = `translate3d(-${landingPosition}px, 0px, 0px)`;
    }

    setTimeout(() => {
      if (myWheel.current) {
        myWheel.current.style.transitionTimingFunction = "";
        myWheel.current.style.transitionDuration = "0s";
        myWheel.current.style.transform = `translate3d(${resetPosition}px, 0px, 0px)`;
      }
    }, 3 * 1000);
  };

  async function handleBet(color: number) {
    if (betAmount === 0) return;

    switch (color) {
      case -1:
      // red
      case 0:
      // green
      case 1:
      // black
    }
  }

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL as string, {
      transports: ["websocket"],
    });

    if (socket) {
      socket.on("connect", () => {
        console.log("connected", socket.id);

        socket.on("nextGameStart", (data: { nextGameStartTime: number }) => {
          setNextGameTime(data.nextGameStartTime);
        });
      });
    }

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="flex p-4 flex-col gap-4 w-full justify-center items-center">
      <div className="relative mx-auto flex w-full rounded justify-center overflow-hidden">
        <div ref={myWheel} className="flex gap-2">
          {Array.from({ length: 29 }).map(() =>
            choiceArray.map((item, index) => {
              if (item === 0)
                return (
                  <div className={"rouletteslot bg-green"} key={index}>
                    {item}
                  </div>
                );
              if (item % 2 === 1)
                return (
                  <div className={"rouletteslot bg-red"} key={index}>
                    {item}
                  </div>
                );
              if (item % 2 === 0)
                return (
                  <div className={"rouletteslot bg-black"} key={index}>
                    {item}
                  </div>
                );
            })
          )}
        </div>
        <span className="z-2 absolute left-1/2 top-0 h-full w-[4px] rounded bg-text" />
      </div>
      <div className="flex w-full justify-between items-center">
        <div className="px-4 py-2 text-sm bg-darker rounded">{betAmount}</div>
        <div className="flex gap-2 items-center">
          <button onClick={() => setBetAmount(0)} className="btn">
            CLEAR
          </button>
          <button onClick={() => setBetAmount(betAmount + 1)} className="btn">
            +1
          </button>
          <button onClick={() => setBetAmount(betAmount + 10)} className="btn">
            +10
          </button>
          <button className="btn" onClick={() => spinWheel(10)}>
            SPIN
          </button>
          <span className="btn">{nextGameTime}</span>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-4 grid-cols-1 w-full">
        <div className="rounded overflow-hidden bg-darker h-[300px]">
          <button
            onClick={() => handleBet(-1)}
            className="w-full bg-red transition-colors p-2"
          >
            BET
          </button>
        </div>
        <div className="rounded overflow-hidden bg-darker h-[300px]">
          <button
            onClick={() => handleBet(0)}
            className="w-full bg-green transition-colors p-2"
          >
            BET
          </button>
        </div>
        <div className="rounded overflow-hidden bg-darker h-[300px]">
          <button
            onClick={() => handleBet(1)}
            className="w-full bg-black transition-colors p-2"
          >
            BET
          </button>
        </div>
      </div>
    </div>
  );
};

export default Roulette;
