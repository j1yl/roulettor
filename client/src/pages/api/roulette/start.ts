import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";
import type { RouletteGameData } from "~/types/game";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RouletteGameData>
) {
  const game = await prisma.game.create({
    data: {
      status: "started",
      clock: 60,
    },
  });

  return res.status(200).json({
    id: game.id,
    status: "started",
    clock: 60,
    bets: [],
  });
}
