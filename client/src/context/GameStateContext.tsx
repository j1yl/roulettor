import React, { useState, createContext, useContext } from "react";

interface GameState {}

interface GameStateContextType {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

const defaultGameState: GameState = {};

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

  return (
    <GameStateContext.Provider value={{ gameState, setGameState }}>
      {children}
    </GameStateContext.Provider>
  );
};

const useGameState = () => useContext(GameStateContext);

export { GameStateProvider, useGameState };
