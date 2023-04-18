import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useContext, useEffect, useState } from "react";
import { RouletteGameContext } from "~/context/RouletteGameContext";

interface BetState {
  status: string;
  betAmount: number;
  betColor: string;
  userId: string;
  gameId: string;
}

interface RoulettePanelProps {
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
}

const RoulettePanel = (props: RoulettePanelProps) => {
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
    axios
      .post("/api/roulette/bet", betState)
      .then((res) => {
        props.setBalance(props.balance - res.data.bet.betAmount);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (rouletteGameContext && session?.user.id) {
      setBetState({
        ...betState,
        userId: session.user.id,
        gameId: rouletteGameContext.rouletteGameData.id,
      });
    }
  }, [rouletteGameContext]);

  return (
    <>
      <section className="flex w-full justify-between">
        <div className="btn-group btn-group-vertical lg:btn-group-horizontal">
          <button className="btn-outline btn-sm btn pointer-events-none">
            Pouch: {props.balance}
          </button>
        </div>
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
                  betState.betAmount + 1 <= 999
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
                  betState.betAmount + 10 <= 999
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
                  betState.betAmount + 100 <= 999
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
                  betState.betAmount * 2 >= 999 ? 999 : betState.betAmount * 2,
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
          <div className="flex w-full items-center justify-center gap-2 bg-base-300 p-2 font-bold">
            <button
              className="btn-primary btn w-full"
              onClick={() => {
                betState.betColor = "red";
                handleBet();
              }}
            >
              Place Bet
            </button>
          </div>
        </div>
        <div className="w-full">
          <div className="flex w-full items-center justify-center rounded-t-lg bg-base-300 p-2 font-bold">
            <h2>Win 14x</h2>
          </div>
          <div className="flex w-full items-center justify-center gap-2 bg-base-300 p-2 font-bold">
            <button
              className="btn-green btn w-full"
              onClick={() => {
                betState.betColor = "green";
                handleBet();
              }}
            >
              Place Bet
            </button>
          </div>
        </div>
        <div className="w-full">
          <div className="flex w-full items-center justify-center rounded-t-lg bg-base-300 p-2 font-bold">
            <h2>Win 2x</h2>
          </div>
          <div className="flex w-full items-center justify-center gap-2 bg-base-300 p-2 font-bold">
            <button
              className="btn-zinc btn w-full"
              onClick={() => {
                betState.betColor = "black";
                handleBet();
              }}
            >
              Place Bet
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default RoulettePanel;
