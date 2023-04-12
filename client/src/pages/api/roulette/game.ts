import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ status: "error", message: "Method not allowed" });
  }

  try {
    // Get the most recent game
    const game = await prisma.game.findFirst({
      orderBy: { createdAt: "desc" },
      include: { bets: true },
    });

    // If there's no game yet, return an error
    if (!game) {
      return res
        .status(404)
        .json({ status: "error", message: "No game found" });
    }

    // Return the game info
    res.status(200).json({
      id: game.id,
      wheelColor: game.wheelColor,
      wheelValue: game.wheelValue,
      bets: game.bets.map((bet) => ({
        id: bet.id,
        userId: bet.userId,
        gameId: bet.gameId,
        betType: bet.betType,
        betAmount: bet.betAmount,
        payout: bet.payout,
        createdAt: bet.createdAt,
        updatedAt: bet.updatedAt,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
}
