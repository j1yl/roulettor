import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { io } from "socket.io-client";

interface betData {
  gameId: string;
  userId: string | undefined;
  betType: string;
  betAmount: number;
}

const socket = io("http://localhost:3001", {
  autoConnect: false,
});

const Roulette = () => {
  const { data: session } = useSession();
  const [connected, setConnected] = useState<boolean>(false);
  const [betAmount, setBetAmount] = useState<number>(0);

  useEffect(() => {
    socket.connect();
    setConnected(true);

    return () => {
      socket.disconnect();
      setConnected(false);
    };
  }, [socket]);

  const placeBet = async (betType: string) => {
    try {
      const betData = {
        userId: session?.user.id,
        betType: betType,
        betAmount: betAmount,
      };
      const res = await axios.post("/api/roulette/bet", betData);
      socket.emit("placeBet", res.data);
    } catch (e) {
      console.error(e);
    }
  };

  if (!session) return <p>Please signin first</p>;

  return (
    <section className="flex w-full max-w-screen-xl flex-col gap-2">
      <div className="flex w-full max-w-screen-xl items-center justify-between gap-2 border-2 border-black p-4">
        <div>
          <p>Amount: {betAmount} coins</p>
        </div>
        <div className="flex gap-2">
          <button
            className="betbtn"
            onClick={() => {
              setBetAmount(betAmount + 1);
            }}
          >
            +1
          </button>
          <button
            className="betbtn"
            onClick={() => {
              setBetAmount(betAmount + 10);
            }}
          >
            +10
          </button>
          <button
            className="betbtn"
            onClick={() => {
              setBetAmount(betAmount / 2);
            }}
          >
            1/2
          </button>
          <button
            className="betbtn"
            onClick={() => {
              setBetAmount(betAmount * 2);
            }}
          >
            x2
          </button>
          <button
            className="betbtn"
            onClick={() => {
              setBetAmount(0);
            }}
          >
            Reset
          </button>
        </div>
      </div>
      <div className="flex w-full max-w-screen-xl items-center justify-between gap-2 border-2 border-black p-4">
        <div className="w-full">
          <button
            className="choicebtn bg-red-400"
            onClick={() => {
              placeBet("red");
            }}
          >
            RED
          </button>
        </div>
        <div
          className="w-full"
          onClick={() => {
            placeBet("green");
          }}
        >
          <button className="choicebtn bg-green-400">GREEN</button>
        </div>
        <div
          className="w-full"
          onClick={() => {
            placeBet("black");
          }}
        >
          <button className="choicebtn bg-slate-600">BLACK</button>
        </div>
      </div>
    </section>
  );
};

export default Roulette;
