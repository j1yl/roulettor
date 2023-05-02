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

const getPayout = (betAmount: number, betColor: string) => {
  if (betColor === "green") {
    return betAmount * 14;
  } else if (betColor === "red" || betColor === "black") {
    return betAmount * 2;
  }
  return 0;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { id, status, value, color } = req.body as SpinRequest;

  if (!id || !status || !color) {
    return res.status(400).json({
      message: "missing required data",
    });
  }

  try {
    const game = await prisma.game.update({
      where: {
        id: id,
      },
      data: {
        status,
        color,
        value,
        clock: 0,
      },
    });

    const bets = await prisma.bet.findMany({
      where: {
        gameId: id,
      },
    });

    for (const bet of bets) {
      if (bet.betColor === color) {
        await prisma.user.update({
          where: {
            id: bet.userId,
          },
          data: {
            balance: {
              increment: getPayout(bet.betAmount, bet.betColor),
            },
          },
        });
        await prisma.bet.update({
          where: {
            id: bet.id,
          },
          data: {
            status: "won",
          },
        });
      } else {
        await prisma.bet.update({
          where: {
            id: bet.id,
          },
          data: {
            status: "loss",
          },
        });
      }
    }

    return res.status(200).send({
      id: game.id,
    });
  } catch (error) {
    return res.status(500).end();
  }
}
