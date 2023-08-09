import crypto from "crypto";
import { Bet, RouletteGameState } from "./gameTypes";
import prisma from "../db";
import { Server } from "socket.io";

export let rouletteGameState: RouletteGameState = {
  rouletteNumber: null,
  bets: [],
};

export function resetGame() {
  rouletteGameState = {
    rouletteNumber: null,
    bets: [],
  };
}

export function randomRouletteNumber() {
  const hash = crypto
    .createHmac("sha256", new Date().toISOString())
    .digest("hex");
  const subHash = hash.substring(0, 8);
  return Math.abs(parseInt(subHash, 16) % 15);
}

export function spinTheWheel() {
  rouletteGameState.rouletteNumber = randomRouletteNumber();
}

export async function placeBet(
  userId: string,
  number: number,
  amount: number,
  color: "red" | "black" | "green"
) {
  const bet: Bet = { userId, number, amount, color };

  rouletteGameState.bets.push(bet);
}

export function evaluateBets() {
  const winningNumber = randomRouletteNumber();
  let winningColor = "";

  if (winningNumber === 0) {
    winningColor = "green";
  } else if (winningNumber % 2 === 0) {
    winningColor = "red";
  } else {
    winningColor = "black";
  }

  rouletteGameState.bets.forEach((bet) => {
    let winnings: number = 0;
    if (bet.color === winningColor) {
      switch (winningColor) {
        case "red":
          winnings = bet.amount * 2;
          break;
        case "black":
          winnings = bet.amount * 2;
          break;
        case "green":
          winnings = bet.amount * 14;
          break;
      }
      addBalanceToUser(bet.userId, winnings);
    }
  });
}

export async function addBalanceToUser(userId: string, amount: number) {
  await prisma.user.update({
    where: { id: parseInt(userId) },
    data: {
      balance: {
        increment: amount,
      },
    },
  });
}

export let nextGameStartTime: number;

export function startGameLoop(io: Server) {
  const gameInterval = 5000; // 60 secs

  const runGame = async () => {
    spinTheWheel();
    evaluateBets();
    resetGame();

    nextGameStartTime = Date.now() + gameInterval;

    console.log("new game", nextGameStartTime);

    io.emit("nextGameStart", { nextGameStartTime });

    setTimeout(runGame, gameInterval);
  };

  runGame();
}
