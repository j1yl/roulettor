import { Router } from "express";
import { createBet } from "../controllers/betController";
import {
  createUser,
  deleteUser,
  getUser,
  updateUser,
} from "../controllers/userController";

const router = Router();

router.post("/api/bet", createBet);
router.get("/api/user/:id", getUser);
router.put("/api/user/:id", updateUser);
router.post("/api/user", createUser);
router.delete("/api/user/:id", deleteUser);

export default router;
