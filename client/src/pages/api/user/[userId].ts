import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(405).json({
      status: "error",
      message: "Method not allowed",
    });
    return;
  }

  const { userId } = req.query;

  if (!userId)
    return res.status(400).json({
      message: "missing required data",
    });

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId as string,
      },
    });

    if (!user)
      return res.status(404).json({ message: "no user found", id: userId });

    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(500).end();
  }
}
