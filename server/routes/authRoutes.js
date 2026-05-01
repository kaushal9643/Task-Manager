import express from "express";
import { register, login, getUsers } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Signup
router.post("/register", register);

// Login
router.post("/login", login);
router.get("/users", protect, getUsers);

export default router;