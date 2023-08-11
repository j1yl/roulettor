"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import socket from "@/lib/socket";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import Timer from "./Timer";

type Props = {};

type Bet = {
  userId: string;
  amount: number;
  color: "red" | "black" | "green";
};

const choiceArray = [0, 11, 5, 10, 6, 9, 7, 8, 1, 14, 2, 13, 3, 12, 4];

const Roulette = (props: Props) => {
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

  const { toast } = useToast();

  const { data: session, update } = useSession();

  const [nextGameTime, setNextGameTime] = useState(0);
  const [betAmount, setBetAmount] = useState(0);
  const [bets, setBets] = useState<Bet[]>([]);
  const [allowBets, setAllowBets] = useState(false);

  async function handleBet(index: number) {
    if (betAmount === 0) {
      toast({
        description: "PLEASE ENTER A BET AMOUNT > 0",
        variant: "destructive",
      });
      return;
    }

    if (bets.find((bet) => bet.userId === session?.user.userId)) {
      toast({
        description: "YOU ALREADY HAVE A BET PLACED",
        variant: "destructive",
      });
      return;
    }

    const color = index === 0 ? "green" : index === -1 ? "red" : "black";

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_ROOT_URL}/api/roulette/bet`,
        {
          amount: betAmount,
          color: color,
          userId: session?.user.userId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        toast({
          description: `BET PLACED ON ${color.toUpperCase()} FOR ${betAmount} COINS`,
        });
        update();
      } else if (response.status !== 201) {
        toast({
          description: `BET FAILED, PLEASE TRY AGAIN`,
        });
      }
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong, please try again later.");
    }
  }

  useEffect(() => {
    socket.on("nextGameStart", (data: { nextGameStartTime: number }) => {
      setNextGameTime(data.nextGameStartTime);
    });

    socket.on("spinResult", (data: { rouletteNumber: number }) => {
      spinWheel(data.rouletteNumber);
      setBets([]);
      setTimeout(() => {
        update();
      }, 2000);
    });

    socket.on("winningBet", (data: { userId: string; amount: number }) => {
      if (data.userId === session?.user.userId) {
        setTimeout(() => {
          toast({
            description: `CONGRATULATIONS, YOU WON ${data.amount} COINS`,
          });
        }, 2000);
      }
    });

    socket.on("losingBet", (data: { userId: string; amount: number }) => {
      if (data.userId === session?.user.userId) {
        setTimeout(() => {
          toast({
            description: `BOO, YOU LOST ${data.amount} COINS`,
          });
        }, 2000);
      }
    });

    socket.on("existingBets", (data: Bet[]) => {
      setBets(data);
    });

    socket.on("newBet", (data: Bet) => {
      setBets((prev: Bet[]) => {
        const betExists = prev.some(
          (bet) =>
            bet.userId === data.userId &&
            bet.color === data.color &&
            bet.amount === data.amount
        );

        if (betExists) {
          return prev;
        } else {
          return [...prev, data];
        }
      });
    });
  }, [update, session?.user.userId, toast]);

  return (
    <div className="flex flex-col gap-8 w-full justify-center items-center">
      <div className="relative mx-auto flex w-full bg-primary-foreground py-2 rounded justify-center overflow-hidden">
        <div ref={myWheel} className="flex gap-2">
          {Array.from({ length: 29 }).map(() =>
            choiceArray.map((item, index) => {
              if (item === 0)
                return (
                  <div className={"rouletteslot bg-green-800"} key={index}>
                    {item}
                  </div>
                );
              if (item % 2 === 1)
                return (
                  <div className={"rouletteslot bg-red-800"} key={index}>
                    {item}
                  </div>
                );
              if (item % 2 === 0)
                return (
                  <div className={"rouletteslot bg-zinc-800"} key={index}>
                    {item}
                  </div>
                );
            })
          )}
        </div>
        <span className="z-2 absolute left-1/2 top-0 h-full w-[4px] rounded bg-primary" />
      </div>
      <Timer
        setAllowBets={setAllowBets}
        gameInterval={parseInt(process.env.NEXT_PUBLIC_GAME_INTERVAL as string)}
        nextGameTime={nextGameTime}
      />
      <div className="flex md:flex-row flex-col gap-4 w-full justify-between items-center">
        <div className="flex text-xs flex-col item-start">
          <span className="whitespace-nowrap">Bet Amount</span>
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              className="w-5 h-5 fill-orange-500"
            >
              <path d="M451-193h55v-52q61-7 95-37.5t34-81.5q0-51-29-83t-98-61q-58-24-84-43t-26-51q0-31 22.5-49t61.5-18q30 0 52 14t37 42l48-23q-17-35-45-55t-66-24v-51h-55v51q-51 7-80.5 37.5T343-602q0 49 30 78t90 54q67 28 92 50.5t25 55.5q0 32-26.5 51.5T487-293q-39 0-69.5-22T375-375l-51 17q21 46 51.5 72.5T451-247v54Zm29 113q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z" />
            </svg>
            <span>{betAmount}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <Button variant="link" onClick={() => setBetAmount(0)}>
            Clear
          </Button>
          <Button
            variant="link"
            onClick={() =>
              setBetAmount(
                Math.floor(betAmount / 2) <= (session?.user.balance as number)
                  ? Math.floor(betAmount / 2)
                  : 0
              )
            }
          >
            1/2
          </Button>
          <Button
            variant="link"
            onClick={() =>
              setBetAmount(
                Math.floor(betAmount / 4) <= (session?.user.balance as number)
                  ? Math.floor(betAmount / 4)
                  : 0
              )
            }
          >
            1/4
          </Button>
          <Button variant="link" onClick={() => setBetAmount(betAmount + 1)}>
            +1
          </Button>
          <Button variant="link" onClick={() => setBetAmount(betAmount + 10)}>
            +10
          </Button>
          <Button variant="link" onClick={() => setBetAmount(betAmount + 100)}>
            +100
          </Button>
          <Button
            variant="link"
            onClick={() =>
              setBetAmount(
                betAmount * 2 <= (session?.user.balance as number)
                  ? betAmount * 2
                  : session?.user
                  ? session?.user.balance
                  : betAmount * 2 <= 20000000000
                  ? betAmount * 2
                  : 20000000000
              )
            }
          >
            x2
          </Button>
          <Button
            variant="link"
            onClick={() => setBetAmount(session?.user.balance as number)}
          >
            Max
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3 grid-cols-1 w-full">
        <div className="rounded flex flex-col w-full">
          {allowBets && session?.user ? (
            <Button
              onClick={() => handleBet(-1)}
              className="bg-red-800 hover:bg-red-900 text-foreground w-full"
            >
              Bet
            </Button>
          ) : (
            <Button
              disabled
              onClick={() => handleBet(-1)}
              className="bg-red-800 hover:bg-red-900 text-foreground w-full"
            >
              Bet
            </Button>
          )}
          <ul className="flex flex-col gap-2">
            {bets
              ?.filter((bet) => bet.color === "red")
              .map((bet, index) => (
                <li key={index} className="p-2 text-left text-sm w-max">
                  <span className="text-orange-500">{bet.amount}</span> · @
                  {bet.userId}
                </li>
              ))}
          </ul>
        </div>
        <div className="rounded flex flex-col w-full">
          {allowBets && session?.user ? (
            <Button
              onClick={() => handleBet(0)}
              className="bg-green-800 hover:bg-green-900 text-foreground w-full"
            >
              Bet
            </Button>
          ) : (
            <Button
              disabled
              onClick={() => handleBet(0)}
              className="bg-green-800 hover:bg-green-900 text-foreground w-full"
            >
              Bet
            </Button>
          )}
          <ul className="flex flex-col gap-2">
            {bets
              ?.filter((bet) => bet.color === "green")
              .map((bet, index) => (
                <li key={index} className="p-2 text-left text-sm w-max">
                  <span className="text-orange-500">{bet.amount}</span> · @
                  {bet.userId}
                </li>
              ))}
          </ul>
        </div>
        <div className="rounded flex flex-col w-full">
          {allowBets && session?.user ? (
            <Button
              onClick={() => handleBet(1)}
              className="bg-zinc-800 hover:bg-zinc-900 text-foreground w-full"
            >
              Bet
            </Button>
          ) : (
            <Button
              disabled
              onClick={() => handleBet(1)}
              className="bg-zinc-800 hover:bg-zinc-900 text-foreground w-full"
            >
              Bet
            </Button>
          )}
          <ul className="flex flex-col gap-2">
            {bets
              ?.filter((bet) => bet.color === "black")
              .map((bet, index) => (
                <li key={index} className="p-2 text-left text-sm w-max">
                  <span className="text-orange-500">{bet.amount}</span> · @
                  {bet.userId}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Roulette;
