import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";

interface SaveBet {
  id: string;
  status: "won" | "lost" | "pending";
}

export default async function saveBet(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "POST") {
    res.status(405).json({
      status: "error",
      message: "Method not allowed",
    });
    return;
  }

  const { id, status } = req.body as SaveBet;

  if (!id || !status) {
    res.status(400).json({
      status: "error",
      message: "Missing required fields",
    });
    return;
  }

  try {
    const bet = await prisma.bet.updateMany({
      where: {
        id: id,
      },
      data: {
        status: status,
      },
    });

    res.status(200).json({
      status: "ok",
      bet,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
}
