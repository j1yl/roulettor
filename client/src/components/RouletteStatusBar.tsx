import React, { useEffect, useState } from "react";
import socket from "~/server/socket";
import type { RouletteGameData } from "~/types/game";

interface StatusBarProps {
  totalTimeInSeconds: number;
}

const RouletteStatusBar: React.FC<StatusBarProps> = ({
  totalTimeInSeconds,
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [status, setStatus] = useState("");
  const [percentComplete, setPercentComplete] = useState(0);

  useEffect(() => {
    socket.on("gameUpdate", (data: RouletteGameData) => {
      setElapsedTime(data.clock);
      setPercentComplete((data.clock / totalTimeInSeconds) * 100);
      setStatus(data.status);
    });
  }, [totalTimeInSeconds]);

  return (
    <div className="rounded-lg p-2">
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
export default RouletteStatusBar;
