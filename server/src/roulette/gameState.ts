import crypto from "crypto";
import { Server } from "socket.io";

import type { Bet, RouletteGameState } from "./gameTypes";

import prisma from "../db";
import { io } from "../server";

export let nextGameStartTime: number;

export let rouletteGameState: RouletteGameState = {
  rouletteNumber: null,
  bets: [],
};

export function resetGame() {
  console.log(`resetting game ${new Date().toLocaleTimeString()}`);
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
  console.log(`\nspinning the wheel ${new Date().toLocaleTimeString()}`);
  rouletteGameState.rouletteNumber = randomRouletteNumber();
  io.emit("spinResult", {
    rouletteNumber: rouletteGameState.rouletteNumber,
  });
  console.log(`- ${rouletteGameState.rouletteNumber}`);
}

export async function placeBet(
  userId: string,
  amount: number,
  color: "red" | "black" | "green"
) {
  const bet: Bet = { userId, amount, color };
  rouletteGameState.bets.push(bet);
  await removeBalanceFromUser(userId, amount);
}

export function getBets() {
  return rouletteGameState.bets;
}

export function evaluateBets() {
  console.log(`evaluating bets ${new Date().toLocaleTimeString()}`);
  const winningNumber = rouletteGameState.rouletteNumber
    ? rouletteGameState.rouletteNumber
    : -1;
  let winningColor = "";

  if (winningNumber % 2 === 0) {
    winningColor = "black";
  } else {
    winningColor = "red";
  }

  if (winningNumber === 0) {
    winningColor = "green";
  }

  let unique = [...new Set(rouletteGameState.bets)];

  unique.forEach((bet) => {
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
      console.log(`- ${bet.userId} won ${winnings} ${bet.color}`);
      io.emit("winningBet", { userId: bet.userId, amount: bet.amount });
      addBalanceToUser(bet.userId, winnings);
    } else {
      console.log(`- ${bet.userId} lost ${bet.amount} ${bet.color}`);
      io.emit("losingBet", { userId: bet.userId, amount: bet.amount });
    }
  });
}

export async function removeBalanceFromUser(userId: string, amount: number) {
  await prisma.user.update({
    where: { id: parseInt(userId) },
    data: {
      balance: {
        decrement: amount,
      },
    },
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

export function startGameLoop(io: Server) {
  const gameInterval = parseInt(process.env.GAME_INTERVAL as string);

  const runGame = async () => {
    spinTheWheel();
    evaluateBets();
    resetGame();

    nextGameStartTime = Date.now() + gameInterval;

    console.log(
      "next game at",
      new Date(nextGameStartTime).toLocaleTimeString()
    );

    io.emit("nextGameStart", { nextGameStartTime });

    setTimeout(runGame, gameInterval);
  };

  runGame();
}
