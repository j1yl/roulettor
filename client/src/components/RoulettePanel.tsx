import React, { useEffect } from "react";
import socket from "~/server/socket";
interface BetState {
  status: string;
  betAmount: number;
  betColor: string;
  userId: string;
  gameId: string;
}

const RoulettePanel = () => {
  // const handleBet = async (color: string) => {
  //   const response = await axios.post("/api/roulette/bet", {
  //     ...betState,
  //     betColor: color,
  //   });
  //   console.log(response);
  // };

  const [currentBets, setCurrentBets] = React.useState<BetState[]>([]);

  useEffect(() => {
    socket.on("gameUpdate", (data) => {
      setCurrentBets(data.bets);
    });
  }, []);

  return (
    <>
      <div className="flex w-full flex-col gap-2">
        <button className="btn-primary btn-sm btn">Place Bet</button>
        <div></div>
      </div>
      <div className="flex w-full flex-col gap-2">
        <button className="btn-sm btn bg-green-800 hover:bg-green-900">
          Place Bet
        </button>
      </div>
      <div className="flex w-full flex-col gap-2">
        <button className="btn-sm btn bg-zinc-800">Place Bet</button>
      </div>
    </>
  );
};

export default RoulettePanel;
