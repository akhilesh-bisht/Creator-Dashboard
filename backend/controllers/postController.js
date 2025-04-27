import { getRedditPosts, getTwitterPosts } from "../services/Posts.js";

// Controller to handle Reddit posts
export const getRedditFeed = async (req, res) => {
  try {
    const posts = await getRedditPosts();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to handle Twitter posts
export const getTwitterFeed = async (req, res) => {
  try {
    const posts = await getTwitterPosts();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
