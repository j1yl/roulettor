import axios from "axios";
import React, { useEffect, useState } from "react";

interface Game {
  id: string;
  status: string;
  clock: number;
  color: string;
  value: number;
}

interface HistoryResponse {
  data: {
    game: Game[];
  };
}

const RouletteHistory = () => {
  const [history, setHistory] = useState<Game[]>([]);
  const [redCount, setRedCount] = useState<number>(0);
  const [blackCount, setBlackCount] = useState<number>(0);
  const [greenCount, setGreenCount] = useState<number>(0);

  useEffect(() => {
    void axios
      .get(`/api/roulette/history`)
      .then((res: HistoryResponse) => {
        setHistory(res.data.game);
        if (history.length > 0) {
          setRedCount(
            history.filter((game) => {
              return game.color === "red";
            }).length
          );
          setBlackCount(
            history.filter((game) => {
              return game.color === "black";
            }).length
          );
          setGreenCount(
            history.filter((game) => {
              return game.color === "green";
            }).length
          );
        }
      })
      .catch();
  });

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
