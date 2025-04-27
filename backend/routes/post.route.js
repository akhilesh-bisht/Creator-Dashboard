// routes/feedRoutes.js
import express from "express";
import {
  getRedditFeed,
  getTwitterFeed,
} from "../controllers/postController.js";

const router = express.Router();

// Route to get Reddit feed
router.get("/reddit", getRedditFeed);

// Route to get Twitter feed
router.get("/twitter", getTwitterFeed);

export default router;
