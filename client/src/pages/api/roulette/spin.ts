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

  await prisma.game.updateMany({
    where: {
      id: id,
    },
    data: {
      status: status,
      value: value,
      clock: 888,
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
