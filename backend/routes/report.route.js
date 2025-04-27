import express from "express";
import {
  deleteReportedFeed,
  ignoreReportedFeed,
  getAllReportedFeeds,
  reportFeed,
} from "../controllers/reportFeed.controller.js"; // import your controller methods

const router = express.Router();

// Route to report a feed
router.post("/:feedId", reportFeed); // reports a specific feed

// Route to get all reported feeds
router.get("/all", getAllReportedFeeds); // get all reported feeds

// Route to delete a reported feed (Admin only)
router.delete("/delete/:feedId", deleteReportedFeed); // delete the reported feed

// Route to ignore a reported feed (Admin only)
router.put("/ignore/:feedId", ignoreReportedFeed); // ignore the reported feed

export default router;
