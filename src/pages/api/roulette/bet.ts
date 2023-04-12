import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";

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

  const { userId, gameId, betAmount, betType } = req.body;

  if (!userId || !gameId || !betAmount || !betType) {
    res.status(400).json({
      status: "error",
      message: "Missing required fields",
    });
    return;
  }

  let user;

  try {
    user = await prisma.user.findUnique({
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
        betType,
        payout: 0,
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
      message: "Bet created",
      bet,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
}
