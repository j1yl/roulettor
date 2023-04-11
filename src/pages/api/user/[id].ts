import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const data = await prisma.user.findUnique({
    where: { id: id as string },
  });

  res.status(200).json(data);
}
