import express from "express";
import {
  getAllUsers,
  updateUserCredits,
  deleteUser,
} from "../controllers/admin.controller.js";
import { isAdmin } from "../middleware/adminMiddleware.js";
const router = express.Router();

// Admin routes
router.get("/users", isAdmin, getAllUsers); // Admin can view all users
router.put("/user/credits", isAdmin, updateUserCredits); // Admin can update user credits
router.delete("/user/:userId", isAdmin, deleteUser); // Admin can delete user

export default router;
