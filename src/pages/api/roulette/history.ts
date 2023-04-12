// pages/api/history.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";
import { Game } from "@prisma/client";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<Game[] | {}>
) {
  if (req.method === "GET") {
    // Get the most recent 10 games
    const games = await prisma.game.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { bets: { include: { user: true } } },
    });
    res.status(200).json(games);
  } else {
    res.status(405).json({ status: "error", message: "Method not allowed" });
  }
}
