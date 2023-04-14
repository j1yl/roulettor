import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";
import { Bet } from "@prisma/client";

import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

export default async function createBet(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "POST") {
    res.status(405).json({
      status: "error",
      message: "Method not allowed",
    });
    return;
  }

  const { userId, gameId, betAmount, betColor, status, payout } =
    req.body as Bet;

  if (!userId || !gameId || !betAmount || !betColor) {
    res.status(400).json({
      status: "error",
      message: "Missing required fields",
    });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      res.status(404).json({ status: "error", message: "Player not found" });
      return;
    }

    if (user.balance < betAmount) {
      res.status(400).json({ message: "Insufficient funds" });
      return;
    }

    const bet = await prisma.bet.create({
      data: {
        userId,
        gameId,
        betAmount,
        betColor,
        status,
        payout,
      },
    });

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        balance: {
          decrement: betAmount,
        },
      },
    });

    res.status(200).json({
      status: "ok",
      bet,
    });

    socket.emit("betPlaced", bet);
  } catch (e) {
    console.error(e);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
}
