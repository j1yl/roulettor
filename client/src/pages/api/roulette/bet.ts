import type { NextApiRequest, NextApiResponse } from "next";
import { io } from "socket.io-client";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";

const socket = io(env.NEXT_PUBLIC_SOCKET_URL, {
  autoConnect: false,
});

interface BetRequest {
  id: string;
  status: string;
  userId: string;
  gameId: string;
  betColor: string;
  betAmount: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  socket.connect();

  if (req.method !== "POST") return res.status(405).end();

  const { status, userId, gameId, betColor, betAmount } =
    req.body as BetRequest;

  if (!status || !userId || !gameId || !betColor || !betAmount) {
    return res.status(400).json({
      message: "missing required data",
    });
  }

  try {
    const existingBet = await prisma.bet.findMany({
      where: {
        userId: userId,
        gameId: gameId,
      },
    });

    if (existingBet.length > 0) {
      return res.status(400).json({
        message: "user already has a bet",
        existingBet,
      });
    }

    const bet = await prisma.bet.create({
      data: {
        status,
        userId,
        gameId,
        betColor,
        betAmount,
      },
    });

    socket.emit("betPlaced", bet);

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        balance: {
          decrement: betAmount,
        },
      },
    });

    socket.disconnect();

    return res.status(200).json({
      bet,
    });
  } catch (error) {
    return res.status(500).end();
  }
}
