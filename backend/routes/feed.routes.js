import express from "express";
import {
  saveFeed,
  getAllSavedFeeds,
  getSingleSavedFeed,
  deleteSavedFeed,
} from "../controllers/feed.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Save a feed
router.post("/save", protect, saveFeed);

// Get all saved feeds
router.get("/saved", protect, getAllSavedFeeds);

// Get a single saved feed by ID
router.get("/saved/:postId", protect, getSingleSavedFeed);

// Delete a saved feed by ID

router.delete("/saved/:postId", protect, deleteSavedFeed);

export default router;
