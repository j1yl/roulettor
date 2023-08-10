import { Request, Response } from "express";
import prisma from "../db";

export async function getUser(req: Request, res: Response) {
  try {
    const userId = parseInt(req.params.id);
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve user" });
  }
}

export async function createUser(req: Request, res: Response) {
  try {
    const { id, name, email } = req.body;
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: parseInt(id),
          name,
          email,
          balance: 100,
        },
      });
    }
    res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const userId = parseInt(req.params.id);
    const { balance } = req.body;

    if (!balance || typeof balance !== "string") {
      return res.status(400).json({ error: "Invalid balance" });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        balance: parseInt(balance),
      },
    });
    res.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const userId = parseInt(req.params.id);
    await prisma.user.delete({ where: { id: userId } });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
}
