import express from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
  updateProfile,
} from "../controllers/user.controller.js";

const router = express.Router();

// Register User
router.post("/register", registerUser);

// Login User
router.post("/login", loginUser);

//  Logout User
router.post("/logout", logoutUser);
// update user
router.patch("/update", updateProfile);

export default router;
