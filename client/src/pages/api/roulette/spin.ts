import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";

interface SpinRequest {
  id: string;
  status: string;
  clock: number;
  bets: [];
  value: number;
  color: string;
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

  const { id, status, value, color } = req.body as SpinRequest;

  const allBets = await prisma.bet.findMany({
    where: {
      gameId: id,
    },
  });

  const getPayout = (color: string) => {
    if (color === "red" || color === "black") {
      return 2;
    } else if (color === "green") {
      return 14;
    }
    return -1;
  };

  const winningBets = allBets
    .filter((bet) => {
      return bet.betColor == color;
    })
    .map((item) => ({
      ...item,
      payout: item.betAmount * getPayout(item.betColor),
    }));

  winningBets.forEach(async (bet) => {
    await prisma.user.updateMany({
      where: {
        id: bet.userId,
      },
      data: {
        balance: {
          increment: bet.payout,
        },
      },
    });
  });

  await prisma.game.updateMany({
    where: {
      id: id,
    },
    data: {
      status: status,
      value: value,
      clock: 0,
      color: color,
    },
  });

  if (!id || !status || !value || !color) {
    return res.status(400).json({
      message: "Missing data",
    });
  }

  return res.status(200).json({
    id: id,
  });
}
