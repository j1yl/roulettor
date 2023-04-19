import React, { useContext } from "react";
import { RouletteGameContext } from "~/context/RouletteGameContext";
import type { RouletteBetData } from "~/types/game";

type Props = {
  color: "red" | "black" | "green";
};

const RouletteBetDisplay = (props: Props) => {
  const rouletteGameContext = useContext(RouletteGameContext);

  if (rouletteGameContext.rouletteGameData.bets) {
    return (
      <>
        {rouletteGameContext.rouletteGameData.bets.map(
          (bet: RouletteBetData) => {
            if (bet.betColor === props.color) {
              return (
                <div
                  key={bet.id}
                  className="flex w-full flex-col p-2 lg:flex-row"
                >
                  <div className="card rounded-box grid flex-grow place-items-center bg-base-300">
                    {bet.betAmount}
                  </div>
                  <div className="divider lg:divider-horizontal"></div>
                  <div className="card rounded-box grid w-full flex-grow place-items-center bg-base-300">
                    {bet.userId}
                  </div>
                </div>
              );
            }
          }
        )}
      </>
    );
  }
  return <></>;
};

export default RouletteBetDisplay;
