// routes/admin.routes.js
import express from "express";
import {
  getAllUsers,
  updateUserCredits,
  getUserCredits,
  deleteUser,
} from "../controllers/admin.controller.js";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Admin Routes (protected + admin check)
router.get("/users", protect, isAdmin, getAllUsers);
router.put("/user/credits/:userId", protect, isAdmin, updateUserCredits);
router.delete("/user/:userId", protect, isAdmin, deleteUser);
router.get("/credits", protect, getUserCredits); // Optional admin check

export default router;
