import express from "express";
import {
  createProject,
  addMember,
  getProjects
} from "../controllers/projectController.js";

import { protect } from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// Only ADMIN can create project
router.post("/", protect, roleMiddleware("ADMIN"), createProject);

// Get all projects (logged in users)
router.get("/", protect, getProjects);

// Only ADMIN can add members
router.post("/:id/add-member", protect, roleMiddleware("ADMIN"), addMember);

export default router;