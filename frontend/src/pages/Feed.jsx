"use client";

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import FeedCard from "../components/FeedCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { getRedditFeed, saveFeed } from "../services/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Feed = () => {
  const { user } = useContext(AuthContext);
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback posts in case the API fails, with more natural content
  const fallbackPosts = Array.from({ length: 10 }, (_, index) => ({
    postId: `fallback-${index}`,
    url: `Interesting Discussion ${index + 1}`,
    title: `Here's a fascinating discussion on a topic that many are talking about lately. Stay tuned for more updates! Post number: ${
      index + 1
    }`,
    timestamp: new Date().toISOString(),
    source: `user${index + 1}`,
  }));

  useEffect(() => {
    fetchFeeds();
  }, []);

  const fetchFeeds = async () => {
    try {
      setLoading(true);
      const redditResponse = await getRedditFeed();

      if (redditResponse?.data) {
        const sortedFeeds = redditResponse.data.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setFeeds(sortedFeeds);
      } else {
        setFeeds(fallbackPosts); // Fallback to more natural posts if the response is empty or invalid
      }
    } catch (error) {
      console.error("Error fetching Reddit feeds:", error);
      toast.error("Failed to load Reddit feed.");
      setFeeds(fallbackPosts); // Fallback to more natural posts if the API request fails
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate mb-4">
          Feed
        </h2>
        <p className="text-sm text-gray-500 mb-6">Browse posts from Reddit</p>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="large" />
          </div>
        ) : (
          <div>
            {feeds.length === 0 ? (
              <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
                No feeds available. Try again later.
              </div>
            ) : (
              feeds.map((feed) => (
                <FeedCard
                  key={feed.id || feed._id}
                  postID={user._id}
                  feed={feed}
                  saveFeed={saveFeed}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
