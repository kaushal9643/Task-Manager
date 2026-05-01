import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all users (only for assignment)
router.get("/", protect, async (req, res) => {
  const users = await User.find({}, "name email role");
  res.json(users);
});

export default router;