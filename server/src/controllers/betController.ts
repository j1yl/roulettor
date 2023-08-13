import { Request, Response } from "express";
import prisma from "../db";
import { Bet } from "../roulette/gameTypes";
import { placeBet, rouletteGameState } from "../roulette/gameState";
import { io } from "../server";

export async function createBet(req: Request, res: Response) {
  try {
    const { userId, amount, color } = req.body as Bet;

    if (req.headers.secret !== (process.env.SECRET as string))
      return res.status(401).json({ error: "Unauthorized" });

    if (!userId || !amount || !color) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (rouletteGameState.bets.find((bet) => bet.userId == userId)) {
      return res.status(400).json({ error: "User already placed a bet" });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(userId),
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.balance < amount) {
      return res.status(400).json({ error: "Insufficient funds" });
    }

    if (amount < 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    if (color !== "red" && color !== "black" && color !== "green") {
      return res.status(400).json({ error: "Invalid color" });
    }

    placeBet(userId, amount, color);

    console.log("bet placed:", userId, amount, color);

    io.emit("newBet", {
      userId,
      amount,
      color,
    });

    res
      .status(201)
      .json({ message: `${amount} bet on ${color} placed for ${user.email}` });
  } catch (error) {
    console.error("Error betting:", error);
    res.status(500).json({ error: "Failed to place bet" });
  }
}
