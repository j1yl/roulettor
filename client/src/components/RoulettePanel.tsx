import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useContext, useState } from "react";
import { RouletteGameContext } from "~/context/RouletteGameContext";
import RouletteBetDisplay from "./RouletteBetDisplay";
import RouletteHistory from "./RouletteHistory";

const MAXBET = 10000;

interface BetState {
  status: string;
  betAmount: number;
  betColor: string;
  userId: string;
  gameId: string;
}

const RoulettePanel = () => {
  const [betState, setBetState] = useState<BetState>({
    status: "pending",
    betAmount: 0,
    betColor: "",
    userId: "",
    gameId: "",
  });
  const rouletteGameContext = useContext(RouletteGameContext);
  const { data: session } = useSession();

  const handleBet = () => {
    if (session?.user.id) {
      betState.userId = session.user.id;
      betState.gameId = rouletteGameContext.rouletteGameData.id;
    }
    void axios.post("/api/roulette/bet", betState).catch();
  };

  return (
    <>
      <section className="flex w-full justify-between">
        <RouletteHistory />
        <div className="btn-group btn-group-vertical lg:btn-group-horizontal">
          <button className="btn-outline btn-sm btn pointer-events-none">
            Bet Amount: {betState.betAmount}
          </button>
          <button
            className="btn-outline btn-sm btn"
            onClick={() =>
              setBetState({
                ...betState,
                betAmount: 0,
              })
            }
          >
            Reset
          </button>
          <button
            className="btn-outline btn-sm btn"
            onClick={() =>
              setBetState({
                ...betState,
                betAmount:
                  betState.betAmount + 1 <= MAXBET
                    ? betState.betAmount + 1
                    : betState.betAmount,
              })
            }
          >
            +1
          </button>
          <button
            className="btn-outline btn-sm btn"
            onClick={() =>
              setBetState({
                ...betState,
                betAmount:
                  betState.betAmount + 10 <= MAXBET
                    ? betState.betAmount + 10
                    : betState.betAmount,
              })
            }
          >
            +10
          </button>
          <button
            className="btn-outline btn-sm btn"
            onClick={() =>
              setBetState({
                ...betState,
                betAmount:
                  betState.betAmount + 100 <= MAXBET
                    ? betState.betAmount + 100
                    : betState.betAmount,
              })
            }
          >
            +100
          </button>
          <button
            className="btn-outline btn-sm btn"
            onClick={() =>
              setBetState({
                ...betState,
                betAmount:
                  Math.floor(betState.betAmount / 2) === 0
                    ? 0
                    : Math.floor(betState.betAmount / 2),
              })
            }
          >
            1/2
          </button>
          <button
            className="btn-outline btn-sm btn"
            onClick={() =>
              setBetState({
                ...betState,
                betAmount:
                  betState.betAmount * 2 >= MAXBET
                    ? MAXBET
                    : betState.betAmount * 2,
              })
            }
          >
            x2
          </button>
        </div>
      </section>
      <section className="flex w-full justify-between gap-2">
        <div className="w-full">
          <div className="flex w-full items-center justify-center rounded-t-lg bg-base-300 p-2 font-bold">
            <h2>Win 2x</h2>
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-2 bg-base-300 p-2 font-bold">
            <button
              className="btn-primary btn w-full"
              onClick={() => {
                betState.betColor = "red";
                handleBet();
              }}
            >
              Place Bet
            </button>
            <RouletteBetDisplay color="red" />
          </div>
        </div>
        <div className="w-full">
          <div className="flex w-full items-center justify-center rounded-t-lg bg-base-300 p-2 font-bold">
            <h2>Win 14x</h2>
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-2 bg-base-300 p-2 font-bold">
            <button
              className="btn-green btn w-full"
              onClick={() => {
                betState.betColor = "green";
                handleBet();
              }}
            >
              Place Bet
            </button>
            <RouletteBetDisplay color="green" />
          </div>
        </div>
        <div className="w-full">
          <div className="flex w-full items-center justify-center rounded-t-lg bg-base-300 p-2 font-bold">
            <h2>Win 2x</h2>
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-2 bg-base-300 p-2 font-bold">
            <button
              className="btn-zinc btn w-full"
              onClick={() => {
                betState.betColor = "black";
                handleBet();
              }}
            >
              Place Bet
            </button>
            <RouletteBetDisplay color="black" />
          </div>
        </div>
      </section>
    </>
  );
};

export default RoulettePanel;
