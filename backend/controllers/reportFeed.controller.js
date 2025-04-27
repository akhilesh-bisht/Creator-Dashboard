import { Feed } from "../models/Feed.js";

// Report a feed by user

export const reportFeed = async (req, res) => {
  try {
    const { feedId } = req.params;
    const { reportReason } = req.body;

    // Find the feed by ID
    const feed = await Feed.findById(feedId);
    if (!feed) {
      return res.status(404).json({ error: "Feed not found" });
    }

    // Mark the feed as reported
    feed.reported = true;
    feed.reportReason = reportReason || "No reason provided";
    await feed.save();

    return res.status(200).json({ message: "Feed reported successfully." });
  } catch (error) {
    console.error("Report Feed Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all reported feeds (for Admin)
export const getAllReportedFeeds = async (req, res) => {
  try {
    // Find all feeds where reported is true
    const reportedFeeds = await Feed.find({ reported: true });

    res.status(200).json({ reportedFeeds });
  } catch (error) {
    console.error("Get Reported Feeds Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a reported feed (Admin)
export const deleteReportedFeed = async (req, res) => {
  try {
    const { feedId } = req.params;

    // Delete the feed by ID
    await Feed.findByIdAndDelete(feedId);

    return res
      .status(200)
      .json({ message: "Reported feed deleted successfully." });
  } catch (error) {
    console.error("Delete Reported Feed Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Ignore a reported feed (Admin cancels the report)
export const ignoreReportedFeed = async (req, res) => {
  try {
    const { feedId } = req.params;

    // Find the feed by ID
    const feed = await Feed.findById(feedId);
    if (!feed) {
      return res.status(404).json({ error: "Feed not found" });
    }

    // Remove the report
    feed.reported = false;
    feed.reportReason = "";
    await feed.save();

    return res.status(200).json({ message: "Report ignored successfully." });
  } catch (error) {
    console.error("Ignore Report Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
