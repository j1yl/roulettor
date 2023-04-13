import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

interface StatusBarProps {
  totalTimeInSeconds: number;
}

const StatusBar: React.FC<StatusBarProps> = ({ totalTimeInSeconds }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [percentComplete, setPercentComplete] = useState(0);

  useEffect(() => {
    const socket = io("http://localhost:3001"); // replace with your server URL

    socket.on("timeUpdate", (data: number) => {
      setElapsedTime(data);
      setPercentComplete((data / totalTimeInSeconds) * 100);
    });

    return () => {
      socket.disconnect();
    };
  }, [totalTimeInSeconds]);

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="h-1 rounded-full bg-zinc-100">
        <div
          className="h-full rounded-full bg-blue-900"
          style={{
            width: `${percentComplete}%`,
            transition: "width 1s linear",
          }}
        />
      </div>
      <div className="flex w-full justify-between text-right text-sm text-zinc-100">
        <p>
          {elapsedTime === totalTimeInSeconds ? (
            <>rolling!</>
          ) : (
            <>place your bets</>
          )}
        </p>
        {`${Math.floor(elapsedTime / 60)}:${(elapsedTime % 60)
          .toString()
          .padStart(2, "0")} / ${Math.floor(totalTimeInSeconds / 60)}:${(
          totalTimeInSeconds % 60
        )
          .toString()
          .padStart(2, "0")}`}
      </div>
    </div>
  );
};

export default StatusBar;
