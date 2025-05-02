"use client";

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import FeedCard from "../components/FeedCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { getUserCredits, getAllSavedFeeds } from "../services/api";

const Dashboard = () => {
  const { user } = useContext(AuthContext); // Assuming AuthContext provides user data
  const [savedFeeds, setSavedFeeds] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log(user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const savedFeedsResponse = await getAllSavedFeeds();
        console.log(
          "Saved Feeds Response:",
          savedFeedsResponse.data.savedFeeds
        );

        setSavedFeeds(savedFeedsResponse.data.savedFeeds);

        const dummyRecentActivity = [
          {
            id: 1,
            type: "saved",
            feed: "How to Optimize Your Content Strategy",
            timestamp: new Date("2023-05-15T10:30:00").toISOString(),
          },
          {
            id: 2,
            type: "reported",
            feed: "Clickbait Article",
            timestamp: new Date("2023-05-14T09:15:00").toISOString(),
          },
          {
            id: 3,
            type: "shared",
            feed: "The Future of Social Media Marketing",
            timestamp: new Date("2023-05-10T14:20:00").toISOString(),
          },
        ];

        setRecentActivity(dummyRecentActivity);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRemoveSavedFeed = (feedId) => {
    setSavedFeeds(savedFeeds.filter((feed) => feed.id !== feedId));
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

        {/* Profile Section */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Profile
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Your account details.
            </p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.fullName}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Email address
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.email}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Username</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.username}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Role</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.role}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Credits</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.credits}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Saved Feeds Section */}
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
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity Section */}
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
                                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                              />
                            </svg>
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            You {activity.type} "{activity.feed}"
                          </p>
                          <p className="text-sm text-gray-500">
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
