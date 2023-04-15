import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";
import { GameInfo } from "@prisma/client";

export default async function saveGame(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "POST") {
    res.status(405).json({
      status: "error",
      message: "Method not allowed",
    });
  }

  const { gameState, winningColor, winningValue, id } = req.body as GameInfo;

  if (!gameState || !winningColor || !winningValue) {
    res.status(400).json({
      status: "error",
      message: "Missing required fields",
    });
  }

  const game = await prisma.gameInfo.updateMany({
    where: {
      id: id,
    },
    data: {
      gameState: gameState,
      winningColor: winningColor,
      winningValue: winningValue,
    },
  });

  res.status(200).json({
    status: "ok",
    data: game,
  });
}
