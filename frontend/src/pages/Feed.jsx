"use client";

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import FeedCard from "../components/FeedCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { getRedditFeed } from "../services/api"; // Reddit feed service
import { getTwitterFeed } from "../services/api"; // Twitter feed service
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Feed = () => {
  const { user } = useContext(AuthContext);
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedSource, setFeedSource] = useState("reddit"); // Default to Reddit

  useEffect(() => {
    fetchFeeds();
  }, [feedSource]);

  const fetchFeeds = async () => {
    try {
      setLoading(true);
      let combinedFeeds = [];

      if (feedSource === "reddit") {
        const redditResponse = await getRedditFeed();
        combinedFeeds = [...combinedFeeds, ...redditResponse.data];
      }

      if (feedSource === "twitter") {
        const twitterResponse = await getTwitterFeed();
        combinedFeeds = [...combinedFeeds, ...twitterResponse.data];
      }

      combinedFeeds.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp) // Sort by timestamp
      );
      setFeeds(combinedFeeds);
    } catch (error) {
      console.error("Error fetching feeds:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Feed
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Discover content from Reddit and Twitter
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <div className="inline-flex rounded-md shadow-sm">
              <button
                onClick={() => setFeedSource("reddit")}
                className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                  feedSource === "reddit"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                } border border-gray-300`}
              >
                Reddit
              </button>
              <button
                onClick={() => setFeedSource("twitter")}
                className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                  feedSource === "twitter"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                } border border-gray-300`}
              >
                Twitter
              </button>
            </div>
          </div>
        </div>

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
                <FeedCard key={feed.id} postID={user._id} feed={feed} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
