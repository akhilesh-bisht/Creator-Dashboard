import { User } from "../models/user.model.js";

// Save Feed Controller
export const saveFeed = async (req, res) => {
  try {
    const userId = req.user._id; // req.user authenticated middleware se aayega
    const { postId, source, title, url } = req.body;

    // Validate input
    if (!postId || !source || !title || !url) {
      return res.status(400).json({
        error: "All fields are required (postId, source, title, url)",
      });
    }

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if feed already saved
    const alreadySaved = user.savedFeeds?.some(
      (feed) => feed.postId === postId
    );

    if (alreadySaved) {
      return res.status(400).json({ error: "Feed already saved" });
    }

    // Add feed to savedFeeds array
    user.savedFeeds.push({
      postId,
      source,
      title,
      url,
      savedAt: new Date(),
    });

    // Add credits (example: +5 credits for saving a feed)
    user.credits += 5;

    await user.save();

    res.status(200).json({
      message: "Feed saved successfully and credits added!",
      user: {
        _id: user._id,
        credits: user.credits,
        savedFeeds: user.savedFeeds,
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
    const userId = req.user._id; // User ID from authenticated request

    // Find the user and select only savedFeeds field
    const user = await User.findById(userId).select("savedFeeds");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return all saved feeds
    return res.status(200).json({ savedFeeds: user.savedFeeds });
  } catch (error) {
    console.error("Get All Saved Feeds Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a specific saved feed by postId
export const getSingleSavedFeed = async (req, res) => {
  try {
    const userId = req.user._id; // User ID from authenticated request
    const { postId } = req.params; // postId from URL parameters

    // Find the user and select only savedFeeds field
    const user = await User.findById(userId).select("savedFeeds");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the specific feed by postId
    const feed = user.savedFeeds.find((feed) => feed.postId === postId);
    if (!feed) {
      return res.status(404).json({ error: "Feed not found" });
    }

    // Return the specific feed
    return res.status(200).json({ feed });
  } catch (error) {
    console.error("Get Single Saved Feed Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

//  delete a saved feed
export const deleteSavedFeed = async (req, res) => {
  try {
    const userId = req.user._id;
    const { postId } = req.params;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Filter out the feed with the given postId
    const originalLength = user.savedFeeds.length;
    user.savedFeeds = user.savedFeeds.filter((feed) => feed.postId !== postId);

    if (user.savedFeeds.length === originalLength) {
      return res.status(404).json({ error: "Feed not found in saved feeds." });
    }

    await user.save(); // Save updated user document

    return res
      .status(200)
      .json({ message: "Saved feed deleted successfully." });
  } catch (error) {
    console.error("Delete Saved Feed Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
