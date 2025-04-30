"use client";

import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import FeedCard from "../components/FeedCard";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  getAllSavedFeeds,
  getUserCredits,
  deleteSavedFeed,
  reportFeed,
} from "../services/api";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [savedFeeds, setSavedFeeds] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [userCredits, setUserCredits] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch user credits
      const creditsResponse = await getUserCredits();
      setUserCredits(creditsResponse.data);

      // Fetch saved feeds
      const feedsResponse = await getAllSavedFeeds();
      setSavedFeeds(feedsResponse.data);

      // Dummy recent activity (can be replaced with actual API if available)
      const dummyRecentActivity = [
        {
          id: 1,
          type: "saved",
          feed: feedsResponse.data[0]?.title || "A feed",
          timestamp: new Date().toISOString(),
        },
        {
          id: 2,
          type: "reported",
          feed: "Inappropriate Content",
          timestamp: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 3,
          type: "shared",
          feed: feedsResponse.data[1]?.title || "Another feed",
          timestamp: new Date(Date.now() - 172800000).toISOString(),
        },
      ];

      setRecentActivity(dummyRecentActivity);
    } catch (error) {
      console.error("Error fetching dashboard data:", error); // Log the full error
      if (error.response) {
        // Axios or similar: error.response contains details of the HTTP error
        toast.error(
          `Failed to load dashboard data: ${
            error.response.data.message || "Unknown error"
          }`
        );
      } else if (error.request) {
        // No response received
        toast.error("Failed to load dashboard data: No response from server.");
      } else {
        // General error
        toast.error(`Failed to load dashboard data: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSavedFeed = async (feedId) => {
    try {
      // Optimistic update: Remove feed from the UI before the API call
      setSavedFeeds(savedFeeds.filter((feed) => feed.id !== feedId));

      await deleteSavedFeed(feedId);
      toast.success("Feed removed from saved items");

      // Update recent activity after removal
      setRecentActivity([
        {
          id: Date.now(),
          type: "removed",
          feed:
            savedFeeds.find((feed) => feed.id === feedId)?.title || "A feed",
          timestamp: new Date().toISOString(),
        },
        ...recentActivity,
      ]);
    } catch (error) {
      console.error("Error removing saved feed:", error);
      toast.error("Failed to remove feed. Please try again.");
      // Revert the optimistic update in case of error
      setSavedFeeds([...savedFeeds]);
    }
  };

  const handleReportFeed = async (feed, reason) => {
    try {
      await reportFeed(feed.id, reason);
      toast.success("Feed reported successfully");

      // Update recent activity after reporting
      setRecentActivity([
        {
          id: Date.now(),
          type: "reported",
          feed: feed.title,
          timestamp: new Date().toISOString(),
        },
        ...recentActivity,
      ]);
    } catch (error) {
      console.error("Error reporting feed:", error);
      toast.error("Failed to report feed. Please try again.");
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="large" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Dashboard
            </h2>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Account Information
            </h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Full name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user?.fullName}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Username</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user?.username}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Email address
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user?.email}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Credits</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                    {userCredits?.credits || user?.credits || 0} Credits
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Saved Feeds
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Your saved content for later reference.
              </p>
            </div>
            <div className="border-t border-gray-200">
              {savedFeeds.length === 0 ? (
                <div className="px-4 py-5 text-center text-gray-500">
                  No saved feeds yet.
                </div>
              ) : (
                <div className="px-4 py-5">
                  {savedFeeds.map((feed) => (
                    <FeedCard
                      key={feed.id}
                      feed={feed}
                      onSave={() => handleRemoveSavedFeed(feed.id)}
                      onReport={handleReportFeed}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Recent Activity
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Your recent interactions with feeds.
              </p>
            </div>
            <div className="border-t border-gray-200">
              {recentActivity.length === 0 ? (
                <div className="px-4 py-5 text-center text-gray-500">
                  No recent activity.
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {recentActivity.map((activity) => (
                    <li key={activity.id} className="px-4 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {activity.type === "saved" && (
                            <svg
                              className="h-5 w-5 text-blue-500"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                              />
                            </svg>
                          )}
                          {activity.type === "reported" && (
                            <svg
                              className="h-5 w-5 text-red-500"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                              />
                            </svg>
                          )}
                          {activity.type === "shared" && (
                            <svg
                              className="h-5 w-5 text-green-500"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 7l5 5-5 5m5-5H6"
                              />
                            </svg>
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-gray-500">
                            {activity.feed} ({activity.type})
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
