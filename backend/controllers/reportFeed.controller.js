import { Feed } from "../models/feed.model.js"; // Assuming Feed model exists

// Report a feed
export const reportFeed = async (req, res) => {
  const { feedId } = req.params;
  const { reason } = req.body; // The reason for reporting

  try {
    const feed = await Feed.findById(feedId);
    if (!feed) {
      return res.status(404).json({ error: "Feed not found." });
    }

    // Update the feed with reported status and reason
    feed.reported = true;
    feed.reportReason = reason;
    await feed.save();

    return res.status(200).json({ message: "Feed reported successfully." });
  } catch (error) {
    console.error("Error reporting feed:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all reported feeds (Admin only)
export const getAllReportedFeeds = async (req, res) => {
  try {
    // Fetch all reports where feed is reported
    const reportedFeeds = await Feed.find({ reported: true });

    return res.status(200).json({ feeds: reportedFeeds });
  } catch (error) {
    console.error("Error fetching reported feeds:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a reported feed (Admin only)

export const deleteReportedFeed = async (req, res) => {
  const { feedId } = req.params;

  try {
    const feed = await Feed.findById(feedId);
    if (!feed) {
      return res.status(404).json({ error: "Feed not found." });
    }

    // Delete the feed
    await feed.remove();

    return res.status(200).json({ message: "Feed deleted successfully." });
  } catch (error) {
    console.error("Error deleting reported feed:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Ignore a reported feed (Admin only)
export const ignoreReportedFeed = async (req, res) => {
  const { feedId } = req.params;

  try {
    const feed = await Feed.findById(feedId);
    if (!feed) {
      return res.status(404).json({ error: "Feed not found." });
    }

    // Mark the feed as ignored (You can add a field for ignored status in your Feed model)
    feed.reported = false;
    feed.reportReason = ""; // Clear the report reason
    await feed.save();

    return res.status(200).json({ message: "Feed ignored successfully." });
  } catch (error) {
    console.error("Error ignoring reported feed:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
