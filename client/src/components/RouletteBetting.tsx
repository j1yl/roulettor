import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { useGameState } from "~/context/GameStateContext";
import { useUserState } from "~/context/UserContext";
import BetDisplay from "./BetDisplay";

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
      <div className="flex items-center justify-between gap-2 rounded-lg">
        <span className="w-full">Bet Amount: {betObject.betAmount}</span>
        <div className="flex w-full justify-end gap-2">
          <button
            className="btn-sm btn"
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
            className="btn-sm btn"
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
            className="btn-sm btn"
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
            className="btn-sm btn"
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
            className="btn-sm btn"
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
            className="btn-sm btn"
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
            className="btn-sm btn"
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
            className="btn bg-red-800 p-4"
          >
            Place Bet
          </button>
          <BetDisplay color="red" />
        </div>
        <div className="flex w-full flex-col gap-2">
          <button
            onClick={() => {
              betObject.betColor = "green";
              betObject.payout = 14;
              handleBet();
            }}
            className="btn bg-green-800 p-4"
          >
            Place Bet
          </button>
          <BetDisplay color="green" />
        </div>
        <div className="flex w-full flex-col gap-2">
          <button
            onClick={() => {
              betObject.betColor = "black";
              betObject.payout = 2;
              handleBet();
            }}
            className="btn bg-zinc-800 p-4"
          >
            Place Bet
          </button>
          <BetDisplay color="black" />
        </div>
      </div>
    </>
  );
};

export default RouletteBetting;
