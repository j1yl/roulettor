import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    const game = await prisma.game.findFirst({
      where: {
        status: "started",
      },
    });

    if (game) {
      return res.status(200).json({
        game,
      });
    }

    return res.status(200).json({
      message: "No active games",
      time: Date.now(),
    });
  } catch (error) {
    return res.status(500).end();
  }
}
