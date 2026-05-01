import express from "express";
import {
  createTask,
  getTasks,
  updateStatus
} from "../controllers/taskController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create task
router.post("/", protect, createTask);

// Get tasks by project
router.get("/project/:projectId", protect, getTasks);

// Update status (assigned member or admin)
router.put("/:id/status", protect, updateStatus);

export default router;