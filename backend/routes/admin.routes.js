import express from "express";
import {
  getAllUsers,
  updateUserCredits,
  getUserCredits,
  deleteUser,
} from "../controllers/admin.controller.js";
import { isAdmin } from "../middleware/adminMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

// Admin routes
router.get("/users", isAdmin, getAllUsers); // Admin can view all users
router.put("/user/credits/:userId", isAdmin, updateUserCredits); // Admin can update user credits
router.delete("/user/:userId", isAdmin, deleteUser); // Admin can delete user
//  all credits
router.get("/credits", protect, getUserCredits);
export default router;
