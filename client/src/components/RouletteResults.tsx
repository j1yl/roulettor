import { GameInfo } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001", {
  autoConnect: false,
});

type Props = {};

const RouletteResults = (props: Props) => {
  const [connected, setConnected] = useState<boolean>(false);
  const [gameInfo, setGameInfo] = useState<GameInfo>();

  useEffect(() => {
    socket.connect();
    setConnected(true);

    socket.on("gameStageUpdate", (data: GameInfo) => {
      setGameInfo(data);
    });

    return () => {
      socket.disconnect();
      setConnected(false);
    };
  }, [socket]);

  return (
    <div className="flex flex-col p-4">
      {connected ? (
        <span>STATUS: CONNECTED</span>
      ) : (
        <span>STATUS: DISCONNECTED</span>
      )}
      {gameInfo?.gameState === "ENDED" ? (
        <div className="flex flex-col">
          <span>GAME STATUS: {gameInfo?.gameState}</span>
          <span>COLOR: {gameInfo?.winningColor}</span>
          <span>VALUE: {gameInfo?.winningValue}</span>
        </div>
      ) : (
        <span>GAME STATUS: {gameInfo?.gameState}</span>
      )}
    </div>
  );
};

export default RouletteResults;
