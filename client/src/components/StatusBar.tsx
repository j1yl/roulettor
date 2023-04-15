import React, { useEffect, useState } from "react";
import { useGameState } from "~/context/GameStateContext";

interface StatusBarProps {
  totalTimeInSeconds: number;
}

const StatusBar: React.FC<StatusBarProps> = ({ totalTimeInSeconds }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [percentComplete, setPercentComplete] = useState(0);
  const { gameState } = useGameState();

  useEffect(() => {
    setElapsedTime(gameState.timeRemaining as number);
    setPercentComplete(
      ((gameState.timeRemaining as number) / totalTimeInSeconds) * 100
    );
  }, [gameState]);

  return (
    <div className="rounded-lg">
      <div className="flex w-full flex-col gap-2">
        <div className="h-1 rounded-full">
          <div
            className="h-full rounded-full bg-zinc-50"
            style={{
              width: `${percentComplete}%`,
              transition: "width 1s linear",
            }}
          />
        </div>
        <div className="flex w-full justify-end text-sm text-zinc-50">
          {`${Math.floor(elapsedTime / 60)}:${(elapsedTime % 60)
            .toString()
            .padStart(2, "0")} / ${Math.floor(totalTimeInSeconds / 60)}:${(
            totalTimeInSeconds % 60
          )
            .toString()
            .padStart(2, "0")}`}
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
