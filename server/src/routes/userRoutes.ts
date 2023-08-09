import express from "express";
import {
  createUser,
  deleteUser,
  getUser,
  updateUser,
} from "../controllers/userController";

const router = express.Router();

router.get("/api/user/:id", getUser);
router.put("/api/user/:id", updateUser);
router.post("/api/user", createUser);
router.delete("/api/user/:id", deleteUser);

export default router;
