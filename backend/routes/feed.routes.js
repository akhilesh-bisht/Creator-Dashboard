import express from "express";
import {
  saveFeed,
  getAllSavedFeeds,
  getSingleSavedFeed,
  deleteSavedFeed,
  shareFeed,
} from "../controllers/feed.controller.js";

const router = express.Router();

// Save a feed
router.post("/save", saveFeed);

// Get all saved feeds
router.get("/saved", getAllSavedFeeds);

// Get a single saved feed by ID
router.get("/saved/:postId", getSingleSavedFeed);

// Delete a saved feed by ID

router.delete("/saved/:postId", deleteSavedFeed);

//  share feed
router.post("/share/:feedId", shareFeed);

export default router;
