import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useGameState } from "~/context/GameStateContext";
import { useUserState } from "~/context/UserContext";

interface BetObject {
  status: "won" | "lost" | "pending";
  userId: string;
  gameId: string;
  betColor: string;
  betAmount: number;
  payout: number;
}

const RouletteBetting = () => {
  const { data: session } = useSession();
  const { userState } = useUserState();
  const { gameState } = useGameState();
  const [betObject, setBetObject] = useState<BetObject>({
    status: "pending",
    userId: "",
    gameId: "",
    betColor: "",
    betAmount: 0,
    payout: 0,
  });

  const handleBet = async () => {
    try {
      betObject.gameId = gameState.id;
      betObject.userId = session?.user.id as string;
      const res = await axios.post("/api/roulette/bet", betObject);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between gap-2 rounded-lg text-sm">
        <div className="flex w-full items-center gap-2">
          <span className="rounded-lg bg-zinc-900 px-4 py-2">
            Amount: {betObject.betAmount}
          </span>
        </div>
        <div className="flex w-full justify-end gap-2">
          <button
            className="btn"
            onClick={() =>
              setBetObject({
                ...betObject,
                betAmount: 0,
              })
            }
          >
            Reset
          </button>
          <button
            className="btn"
            onClick={() =>
              setBetObject({
                ...betObject,
                betAmount:
                  betObject.betAmount + 1 <= userState.balance
                    ? betObject.betAmount + 1
                    : betObject.betAmount,
              })
            }
          >
            +1
          </button>
          <button
            className="btn"
            onClick={() =>
              setBetObject({
                ...betObject,
                betAmount:
                  betObject.betAmount + 10 <= userState.balance
                    ? betObject.betAmount + 10
                    : betObject.betAmount,
              })
            }
          >
            +10
          </button>
          <button
            className="btn"
            onClick={() =>
              setBetObject({
                ...betObject,
                betAmount:
                  betObject.betAmount + 100 <= userState.balance
                    ? betObject.betAmount + 100
                    : betObject.betAmount,
              })
            }
          >
            +100
          </button>
          <button
            className="btn"
            onClick={() =>
              setBetObject({
                ...betObject,
                betAmount:
                  Math.floor(betObject.betAmount / 2) === 0
                    ? 0
                    : Math.floor(betObject.betAmount / 2),
              })
            }
          >
            1/2
          </button>
          <button
            className="btn"
            onClick={() =>
              setBetObject({
                ...betObject,
                betAmount:
                  betObject.betAmount * 2 >= userState.balance
                    ? userState.balance
                    : betObject.betAmount * 2,
              })
            }
          >
            x2
          </button>
          <button
            className="btn"
            onClick={() =>
              setBetObject({
                ...betObject,
                betAmount: userState.balance,
              })
            }
          >
            Max
          </button>
        </div>
      </div>
      <div className="flex items-start justify-between gap-2 rounded-lg">
        <div className="flex w-full flex-col gap-2">
          <button
            onClick={() => {
              betObject.betColor = "red";
              betObject.payout = 2;
              handleBet();
            }}
            className="w-full rounded-lg bg-red-700 p-4"
          >
            Place Bet (Win 2x)
          </button>
          <div className="flex flex-col gap-2">
            {gameState.bets
              .filter(() => {
                return betObject.betColor === "red";
              })
              .map((item) => (
                <div className="flex w-full items-center justify-start rounded-lg bg-zinc-900 p-2">
                  <span>
                    {item.userId}: {item.betAmount}
                  </span>
                </div>
              ))}
          </div>
        </div>
        <div className="flex w-full flex-col gap-2">
          <button
            onClick={() => {
              betObject.betColor = "green";
              betObject.payout = 14;
              handleBet();
            }}
            className="w-full rounded-lg bg-green-700 p-4"
          >
            Place Bet (Win 14x)
          </button>
          <div className="flex flex-col gap-2">
            {gameState.bets
              .filter(() => {
                return betObject.betColor === "green";
              })
              .map((item) => (
                <div className="flex w-full items-center justify-start rounded-lg bg-zinc-900 p-2">
                  <span>
                    {item.userId}: {item.betAmount}
                  </span>
                </div>
              ))}
          </div>
        </div>
        <div className="flex w-full flex-col gap-2">
          <button
            onClick={() => {
              betObject.betColor = "black";
              betObject.payout = 2;
              handleBet();
            }}
            className="w-full rounded-lg bg-zinc-900 p-4"
          >
            Place Bet (Win 2x)
          </button>
          <div className="flex flex-col gap-2">
            {gameState.bets
              .filter(() => {
                return betObject.betColor === "black";
              })
              .map((item) => (
                <div className="flex w-full items-center justify-start rounded-lg bg-zinc-900 p-2">
                  <span>
                    {item.userId}: {item.betAmount}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default RouletteBetting;
