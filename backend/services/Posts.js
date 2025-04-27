import axios from "axios";

// Function to get Reddit posts
export const getRedditPosts = async () => {
  try {
    // Fetch posts from Reddit (using "new.json" or "hot.json" to get recent posts)
    const response = await axios.get(
      "https://www.reddit.com/r/javascript/new.json?limit=10" // Increase limit if needed
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
export const getTwitterPosts = async () => {
  try {
    // Fetch posts from Twitter
    const response = await axios.get(
      "https://api.twitter.com/2/tweets/search/recent?query=javascript",
      {
        headers: {
          Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        },
      }
    );
    const tweets = response.data.data;

    console.log("Serving from Twitter API 🛜");
    return tweets;
  } catch (error) {
    throw new Error("Error fetching Twitter posts");
  }
};
