import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.query.key !== env.API_PASSWORD) {
    return res.status(401).end();
  }

  if (req.method !== "GET") return res.status(405).end();

  try {
    const allUsers = await prisma.user.findMany({
      orderBy: {
        balance: "desc",
      },
    });

    const users = allUsers.slice(0, 10);

    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).end();
  }
}
