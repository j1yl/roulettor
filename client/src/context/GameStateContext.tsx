import React, { useState, createContext, useContext, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001", {
  autoConnect: false,
});

interface GameState {
  id: string;
  gameState: "STARTED" | "ENDED";
  winningColor?: "red" | "black" | "green" | "none";
  winningValue?: number;
  bets: BetInfo[];
  timeRemaining?: number;
}

interface BetInfo {
  id: string;
  userId: string;
  gameId: string;
  betColor: string;
  betAmount: number;
  createdAt: Date;
}

interface GameStateContextType {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

const defaultGameState: GameState = {
  id: "",
  gameState: "STARTED",
  winningColor: "none",
  winningValue: 0,
  bets: [],
  timeRemaining: 0,
};

const GameStateContext = createContext<GameStateContextType>({
  gameState: defaultGameState,
  setGameState: () => {},
});

type GameStateProviderProps = {
  children: React.ReactNode;
};

const GameStateProvider: React.FC<GameStateProviderProps> = ({
  children,
}: GameStateProviderProps) => {
  const [gameState, setGameState] = useState<GameState>(defaultGameState);

  useEffect(() => {
    socket.connect();
    socket.on("gameUpdate", (data: GameState) => {
      setGameState({ ...data });
    });
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <GameStateContext.Provider value={{ gameState, setGameState }}>
      {children}
    </GameStateContext.Provider>
  );
};

const useGameState = () => useContext(GameStateContext);

export { GameStateProvider, useGameState };
