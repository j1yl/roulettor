import React, { useContext, useEffect, useState } from "react";
import { RouletteGameContext } from "../context/RouletteGameContext";

interface StatusBarProps {
  totalTimeInSeconds: number;
}

const StatusBar: React.FC<StatusBarProps> = ({ totalTimeInSeconds }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [percentComplete, setPercentComplete] = useState(0);
  const rouletteGameContext = useContext(RouletteGameContext);

  useEffect(() => {
    setElapsedTime(rouletteGameContext.rouletteGameData.clock);
    setPercentComplete(
      (rouletteGameContext.rouletteGameData.clock / totalTimeInSeconds) * 100
    );
  }, [rouletteGameContext, totalTimeInSeconds]);

  return (
    <div className="rounded-lg">
      <div className="flex w-full flex-col gap-2">
        <div className="h-1 rounded-full">
          <div
            className="h-full rounded-full bg-primary"
            style={{
              width: `${percentComplete}%`,
              transition: "width 1s linear",
            }}
          />
        </div>
        <div className="text-md flex w-full justify-end">
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
