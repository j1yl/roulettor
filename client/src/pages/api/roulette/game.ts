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
    const game = await prisma.gameInfo.findFirst({
      orderBy: { createdAt: "desc" },
      include: { bets: true },
    });

    if (!game) {
      return res
        .status(404)
        .json({ status: "error", message: "No game found" });
    }

    // Return the game info
    // res.status(200).json({
    //   id: game.id,
    //   wheelColor: game.wheelColor,
    //   wheelValue: game.wheelValue,
    // });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
}
