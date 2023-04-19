export interface RouletteGameData {
  id: string;
  status: string;
  clock: number;
  color?: string;
  value?: number;
  bets: RouletteBetData[];
}

export interface RouletteBetData {
  id: string;
  gameId: string;
  userId: string;
  betColor: string;
  betAmount: number;
  payout: number;
  status: string;
}
