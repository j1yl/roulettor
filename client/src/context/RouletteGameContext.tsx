import React, { createContext, useEffect, useState } from "react";
import type { RouletteGameData } from "../types/game";
import { io } from "socket.io-client";

const socket = io("http://stat.roulettor.com", {
  autoConnect: false,
});

type RouletteGameContextType = {
  rouletteGameData: RouletteGameData;
  setRouletteGameData: React.Dispatch<React.SetStateAction<RouletteGameData>>;
};

type RouletteGameContextProviderProps = {
  children: React.ReactNode;
};

const defaultRouletteGameData: RouletteGameData = {
  id: "",
  status: "",
  clock: 0,
  bets: [],
};

export const RouletteGameContext = createContext<RouletteGameContextType>(
  {} as RouletteGameContextType
);

export const RouletteGameContextProvider = ({
  children,
}: RouletteGameContextProviderProps) => {
  const [rouletteGameData, setRouletteGameData] = useState<RouletteGameData>(
    defaultRouletteGameData
  );

  useEffect(() => {
    socket.connect();
    socket.on("gameUpdate", (data: RouletteGameData) => {
      setRouletteGameData({ ...data });
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <RouletteGameContext.Provider
      value={{ rouletteGameData, setRouletteGameData }}
    >
      {children}
    </RouletteGameContext.Provider>
  );
};
