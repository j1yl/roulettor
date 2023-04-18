import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const game = await prisma.game.findFirst({
    where: {
      status: "started",
    },
  });

  if (game) {
    console.log(game);
    return res.status(200).json({
      game,
    });
  }

  return res.status(200).json({
    message: "No active games",
    time: Date.now(),
  });
}
