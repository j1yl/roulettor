import React, { createContext, useContext, useState } from "react";

interface GameState {
  gameId: string;
  wheelValue: number;
  wheelColor: string;
  players: PlayerState[];
}

interface PlayerState {
  id: string;
  name: string;
  balance: number;
  bets: BetState[];
}

interface BetState {
  type: string;
  amount: number;
  payout: number;
}

interface GameStateContextValue {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

interface GameProviderProps {
  children: React.ReactNode;
}

const GameStateContext = createContext<GameStateContextValue | undefined>(
  undefined
);

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error("useGameState must be used within a GameStateProvider");
  }
  return context;
};

export const GameStateProvider = ({ children }: GameProviderProps) => {
  const [gameState, setGameState] = useState<GameState>({
    gameId: "",
    wheelValue: 0,
    wheelColor: "",
    players: [],
  });

  const value = { gameState, setGameState };

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
};
