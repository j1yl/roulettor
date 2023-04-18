import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "GET") {
    res.status(405).json({
      status: "error",
      message: "Method not allowed",
    });
    return;
  }
  const { userId } = req.query;
  if (!userId) {
    res.status(400).json({
      status: "error",
      message: "Missing required fields",
    });
    return;
  }

  let user;

  try {
    user = await prisma.user.findUnique({
      where: {
        id: userId as string,
      },
    });
    if (!user) {
      res.status(404).json({ status: "error", message: "User not found" });
      return;
    }
    res.status(200).json({
      user,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
}
