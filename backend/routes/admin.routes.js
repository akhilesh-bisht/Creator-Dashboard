import express from "express";
import {
  getAllUsers,
  getFeedActivity,
} from "../controllers/admin.controller.js";
import { authenticateAdmin } from "../middlewares/auth.middleware.js"; // Admin verification middleware

const router = express.Router();

router.get("/users", authenticateAdmin, getAllUsers); // Get all users
router.get("/feed-activity", authenticateAdmin, getFeedActivity); // Get feed activity

export default router;
