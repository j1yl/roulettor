export type RouletteGameState = {
  rouletteNumber: number | null;
  bets: Bet[];
};

export type Bet = {
  userId: string;
  color: "red" | "black" | "green";
  amount: number;
};
