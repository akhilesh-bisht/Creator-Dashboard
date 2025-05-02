import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { Feed } from "../models/feed.model.js";
// Save Feed
export const saveFeed = async (req, res) => {
  try {
    const userId = req.user._id;
    const { postId, source, title, url } = req.body;

    if (!postId || !source || !title || !url) {
      return res.status(400).json({
        error: "All fields are required (postId, source, title, url)",
      });
    }

    // Check if feed already exists
    let feed = await Feed.findOne({ postId });

    if (!feed) {
      feed = new Feed({ postId, source, title, url });
      await feed.save();
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if already saved
    const alreadySaved = user.savedFeeds.includes(feed._id);
    if (!alreadySaved) {
      user.savedFeeds.push(feed._id);
      user.credits += 5;
      await user.save();
    }

    res.status(200).json({
      message: alreadySaved
        ? "Feed already saved (ignored)"
        : "Feed saved successfully and credits added!",
      user: {
        _id: user._id,
        credits: user.credits,
        savedFeeds: user.savedFeeds,
        postId: postId,
      },
    });
  } catch (error) {
    console.error("Save Feed Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all saved feeds for a user
export const getAllSavedFeeds = async (req, res) => {
  try {
    const userId = req.user._id;

    // Populate savedFeeds with Feed details
    const user = await User.findById(userId).populate("savedFeeds");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ savedFeeds: user.savedFeeds });
  } catch (error) {
    console.error("Get All Saved Feeds Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a single saved feed by postId
export const getSingleSavedFeed = async (req, res) => {
  try {
    const userId = req.user._id;
    const { postId } = req.params;

    const user = await User.findById(userId).populate("savedFeeds");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the feed by matching postId
    const feed = user.savedFeeds.find((feed) => feed.postId === postId);
    if (!feed) {
      return res.status(404).json({ error: "Feed not found" });
    }

    res.status(200).json({ feed });
  } catch (error) {
    console.error("Get Single Saved Feed Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a saved feed
export const deleteSavedFeed = async (req, res) => {
  try {
    const userId = req.user._id;
    const { postId } = req.params;

    const user = await User.findById(userId).populate("savedFeeds");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the feed to remove
    const feedToRemove = user.savedFeeds.find((feed) => feed.postId === postId);

    if (!feedToRemove) {
      return res.status(404).json({ error: "Feed not found in saved feeds." });
    }

    // Remove feed's ObjectId from savedFeeds
    user.savedFeeds = user.savedFeeds.filter(
      (feed) => feed._id.toString() !== feedToRemove._id.toString()
    );

    await user.save();

    res.status(200).json({ message: "Saved feed deleted successfully." });
  } catch (error) {
    console.error("Delete Saved Feed Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Share Feed Controller
export const shareFeed = async (req, res) => {
  const { feedId } = req.params; // Get the feedId from the URL parameter

  try {
    // Check if the feedId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(feedId)) {
      return res.status(400).json({ error: "Invalid feedId format." });
    }

    // Find the feed in the database by feedId
    const feed = await Feed.findById(feedId);

    if (!feed) {
      return res.status(404).json({ error: "Feed not found." });
    }

    // Generate shareable URLs for Twitter and LinkedIn
    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      feed.content
    )}&url=${encodeURIComponent(feed.url)}`;
    const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      feed.url
    )}`;

    // Respond with the generated share links
    return res.status(200).json({
      message: "Share links generated successfully.",
      shareLinks: {
        twitter: twitterShareUrl,
        linkedin: linkedInShareUrl,
      },
    });
  } catch (error) {
    console.error("Error processing the request:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
