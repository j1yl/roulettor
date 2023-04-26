import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { RouletteGameContext } from "~/context/RouletteGameContext";

interface Game {
  id: string;
  status: string;
  clock: number;
  color: string;
  value: number;
}

interface HistoryResponse {
  data: {
    lastFiftyGames: Game[];
  };
}

const RouletteHistory = () => {
  const [redCount, setRedCount] = useState<number>(0);
  const [blackCount, setBlackCount] = useState<number>(0);
  const [greenCount, setGreenCount] = useState<number>(0);

  const rouletteGameContext = useContext(RouletteGameContext);

  useEffect(() => {
    void axios
      .get(`/api/roulette/history`)
      .then((res: HistoryResponse) => {
        const { lastFiftyGames } = res.data;
        const red = lastFiftyGames.filter((g) => g.color === "red");
        const black = lastFiftyGames.filter((g) => g.color === "black");
        const green = lastFiftyGames.filter((g) => g.color === "green");
        setRedCount(red.length);
        setBlackCount(black.length);
        setGreenCount(green.length);
      })
      .catch();
  }, [rouletteGameContext]);

  return (
    <>
      <div className="btn-group btn-group-vertical lg:btn-group-horizontal">
        <h3 className="btn-outline btn-sm btn pointer-events-none">Last 100</h3>
        <div className="btn-outline btn-sm btn pointer-events-none">
          <span>R: {redCount}</span>
        </div>
        <div className="btn-outline btn-sm btn pointer-events-none">
          <span>G: {greenCount}</span>
        </div>
        <div className="btn-outline btn-sm btn pointer-events-none">
          <span>B: {blackCount}</span>
        </div>
      </div>
    </>
  );
};

export default RouletteHistory;
