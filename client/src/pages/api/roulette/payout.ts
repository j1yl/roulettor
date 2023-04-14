import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";

interface payoutData {
  status: string;
  userId: string;
  payout: number;
  betAmount: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "POST") {
    res.status(405).json({
      status: "error",
      message: "Method not allowed",
    });
  }

  const { status, userId, payout, betAmount }: payoutData = req.body;

  await prisma.user.updateMany({
    where: {
      id: userId,
    },
    data: {
      balance: {
        increment: betAmount * payout,
      },
    },
  });

  res.status(200).json({
    status: "ok",
  });
}
