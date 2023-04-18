import { useSession } from "next-auth/react";
import React, { useContext, useEffect, useState } from "react";
import { RouletteGameContext } from "~/context/RouletteGameContext";

interface BetData {
  betAmount: number;
  betType: string;
  userId: string;
  gameId: string;
}

const RoulettePanel = () => {
  const [betData, setBetData] = useState<BetData>({
    betAmount: 0,
    betType: "",
    userId: "",
    gameId: "",
  });

  const rouletteGameContext = useContext(RouletteGameContext);
  const { data: session } = useSession();

  useEffect(() => {
    if (rouletteGameContext && session?.user.id) {
      setBetData({
        ...betData,
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
            Pouch:
          </button>
        </div>
        <div className="btn-group btn-group-vertical lg:btn-group-horizontal">
          <button className="btn-outline btn-sm btn pointer-events-none">
            Bet Amount: {betData.betAmount}
          </button>
          <button
            className="btn-outline btn-sm btn"
            onClick={() =>
              setBetData({
                ...betData,
                betAmount: 0,
              })
            }
          >
            Reset
          </button>
          <button
            className="btn-outline btn-sm btn"
            onClick={() =>
              setBetData({
                ...betData,
                betAmount: betData.betAmount + 1,
              })
            }
          >
            +1
          </button>
          <button
            className="btn-outline btn-sm btn"
            onClick={() =>
              setBetData({
                ...betData,
                betAmount: betData.betAmount + 10,
              })
            }
          >
            +10
          </button>
          <button
            className="btn-outline btn-sm btn"
            onClick={() =>
              setBetData({
                ...betData,
                betAmount: betData.betAmount + 100,
              })
            }
          >
            +100
          </button>
          <button
            className="btn-outline btn-sm btn"
            onClick={() =>
              setBetData({
                ...betData,
                betAmount: Math.floor(betData.betAmount / 2),
              })
            }
          >
            1/2
          </button>
          <button
            className="btn-outline btn-sm btn"
            onClick={() =>
              setBetData({
                ...betData,
                betAmount: betData.betAmount * 2,
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
            <button className="btn-primary btn w-full">Place Bet</button>
          </div>
        </div>
        <div className="w-full">
          <div className="flex w-full items-center justify-center rounded-t-lg bg-base-300 p-2 font-bold">
            <h2>Win 14x</h2>
          </div>
          <div className="flex w-full items-center justify-center gap-2 bg-base-300 p-2 font-bold">
            <button className="btn-green btn w-full">Place Bet</button>
          </div>
        </div>
        <div className="w-full">
          <div className="flex w-full items-center justify-center rounded-t-lg bg-base-300 p-2 font-bold">
            <h2>Win 2x</h2>
          </div>
          <div className="flex w-full items-center justify-center gap-2 bg-base-300 p-2 font-bold">
            <button className="btn-zinc btn w-full">Place Bet</button>
          </div>
        </div>
      </section>
    </>
  );
};

export default RoulettePanel;
