import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    const game = await prisma.game.findMany({
      where: {
        status: "ended",
      },
    });
    const lastFiftyGames = game.slice(0, 50);

    if (game.length > 50) {
      return res.status(200).json({
        lastFiftyGames,
      });
    }

    return res.status(200).json({
      game,
    });
  } catch (error) {
    return res.status(500).end();
  }
}
