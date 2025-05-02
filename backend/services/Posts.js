import axios from "axios";

// Function to get Reddit posts
export const getRedditPosts = async () => {
  try {
    // Fetch posts from Reddit (using "new.json" or "hot.json" to get recent posts)
    const response = await axios.get(
      "https://www.reddit.com/r/javascript/new.json?limit=18" // Increase limit if needed
    );

    // Log the full response to see the structure
    console.log("Reddit API Response: ", response.data);

    // Check if there are any posts
    if (!response.data || !response.data.data || !response.data.data.children) {
      console.log("No posts found in the Reddit response.");
      return [];
    }

    // Extract post data from response
    const posts = response.data.data.children.map((post) => post.data);

    // Log posts to see the extracted data
    console.log("Extracted Reddit Posts: ", posts);

    return posts;
  } catch (error) {
    console.error("Error fetching Reddit posts:", error.message);
    throw new Error("Error fetching Reddit posts");
  }
};

// Function to get Twitter posts

// Replace in-memory with filesystem cache (server-safe)
import fs from "fs/promises";
const CACHE_FILE = "./.twitter_cache.json";

export const getTwitterPosts = async () => {
  const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

  if (!TWITTER_BEARER_TOKEN) {
    throw new Error("Twitter Bearer Token is not set.");
  }

  try {
    const response = await axios.get(
      "https://api.twitter.com/2/tweets/search/recent?query=javascript&tweet.fields=created_at,author_id",
      {
        headers: {
          Authorization: `Bearer ${TWITTER_BEARER_TOKEN}`,
        },
      }
    );

    const tweets = response.data.data;
    await fs.writeFile(CACHE_FILE, JSON.stringify(tweets));

    console.log("✅ Served fresh from Twitter API");
    return tweets;
  } catch (error) {
    if (error.response?.status === 429) {
      console.warn("⚠️ Rate limit hit. Loading from cache...");
      try {
        const cachedData = await fs.readFile(CACHE_FILE, "utf-8");
        return JSON.parse(cachedData);
      } catch {
        throw new Error("Rate limit hit and no cached data available.");
      }
    }

    throw new Error("Twitter fetch error");
  }
};
