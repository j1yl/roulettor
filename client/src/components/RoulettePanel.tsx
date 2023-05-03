import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import type { RouletteGameData } from "~/types/game";
import socket from "~/server/socket";
interface BetState {
  status: string;
  betAmount: number;
  betColor: string;
  userId: string;
  gameId: string;
}

type Props = {
  betAmount: number;
  valid: boolean;
};

const RoulettePanel = (props: Props) => {
  const [currentBets, setCurrentBets] = useState<BetState[]>([]);
  const [currentGame, setCurrentGame] = useState({
    status: "",
    gameId: "",
  });
  const { data: session } = useSession();
  const handleBet = async (color: string) => {
    const betData = {
      userId: session?.user.id,
      gameId: currentGame.gameId,
      status: "pending",
      betAmount: props.betAmount,
      betColor: color,
    };
    const res = await axios.post("/api/roulette/bet", betData);
    socket.emit("betPlaced", res.data);
  };

  useEffect(() => {
    socket.on("gameUpdate", (data: RouletteGameData) => {
      setCurrentBets(data.bets);
      setCurrentGame({
        status: data.status,
        gameId: data.id,
      });
    });
  }, []);

  return (
    <>
      <div className="flex flex-col gap-2 md:flex-row">
        <div className="flex w-full flex-col gap-2">
          {props.valid ? (
            <button
              className="btn-primary btn-sm btn"
              onClick={() => void handleBet("red")}
            >
              Place Bet 2x
            </button>
          ) : (
            <button
              className="btn-disabled btn-primary btn-sm btn bg-primary"
              onClick={() => void handleBet("red")}
            >
              Place Bet 2x
            </button>
          )}
          {currentBets &&
            currentBets
              .filter((bet) => {
                return bet.betColor === "red";
              })
              .map((bet, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span>{bet.betAmount}</span>
                  <span>{bet.userId}</span>
                </div>
              ))}
        </div>
        <div className="flex w-full flex-col gap-2">
          {props.valid ? (
            <button
              className="btn-sm btn bg-green-800 hover:bg-green-900"
              onClick={() => void handleBet("green")}
            >
              Place Bet 2x
            </button>
          ) : (
            <button
              className="btn-disabled btn-sm btn bg-green-800 hover:bg-green-900"
              onClick={() => void handleBet("green")}
            >
              Place Bet 14x
            </button>
          )}
          {currentBets &&
            currentBets
              .filter((bet) => {
                return bet.betColor === "green";
              })
              .map((bet, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span>{bet.betAmount}</span>
                  <span>{bet.userId}</span>
                </div>
              ))}
        </div>
        <div className="flex w-full flex-col gap-2">
          {props.valid ? (
            <button
              className="btn-sm btn bg-zinc-800"
              onClick={() => void handleBet("black")}
            >
              Place Bet 2x
            </button>
          ) : (
            <button
              className="btn-disabled btn-sm btn bg-zinc-800"
              onClick={() => void handleBet("black")}
            >
              Place Bet 2x
            </button>
          )}
          {currentBets &&
            currentBets
              .filter((bet) => {
                return bet.betColor === "black";
              })
              .map((bet, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span>{bet.betAmount}</span>
                  <span>{bet.userId}</span>
                </div>
              ))}
        </div>
      </div>
    </>
  );
};

export default RoulettePanel;
