import type { NextApiRequest, NextApiResponse } from "next";
import { io } from "socket.io-client";
import { prisma } from "~/server/db";

const socket = io("http://localhost:3001", {
  autoConnect: false,
});

interface BetRequest {
  id: string;
  status: string;
  userId: string;
  gameId: string;
  betColor: string;
  betAmount: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "POST") {
    res.status(405).json({
      message: "Method not allowed",
    });
  }

  const { status, userId, gameId, betColor, betAmount } =
    req.body as BetRequest;
  if (!status || !userId || !gameId || !betColor || !betAmount) {
    return res.status(400).json({
      message: "Missing parameters",
    });
  }

  const bet = await prisma.bet.create({
    data: {
      status,
      userId,
      gameId,
      betColor,
      betAmount,
    },
  });

  socket.emit("bet", bet);

  await prisma.user.updateMany({
    where: {
      id: userId,
    },
    data: {
      balance: {
        decrement: betAmount,
      },
    },
  });

  return res.status(200).json({
    message: "Bet created",
    bet,
  });
}
