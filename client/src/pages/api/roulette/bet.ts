import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";

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

  const { id, status, userId, gameId, betColor, betAmount } =
    req.body as BetRequest;
  if (!id || !status || !userId || !gameId || !betColor || !betAmount) {
    return res.status(400).json({
      message: "Missing parameters",
    });
  }

  const bet = await prisma.bet.create({
    data: {
      id,
      status,
      userId,
      gameId,
      betColor,
      betAmount,
    },
  });

  return res.status(200).json({
    message: "Bet created",
    bet,
  });
}
