"use client";

import { useState, useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

const FeedCard = ({
  feed,
  onSave,
  onShare,
  onReport,
  saveFeed,
  isSaved = false,
}) => {
  const { user, setUser } = useContext(AuthContext);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reason, setReportReason] = useState("");
  const [saved, setSaved] = useState(isSaved);

  // Handle Save Feed
  const handleSave = async () => {
    try {
      const feedData = {
        postId: feed._id || feed.id,
        source: feed.subreddit,
        title: feed.title,
        url: feed.url,
      };

      // Save the feed (implementation might differ depending on how you handle saving)
      saveFeed(feedData);
      toast.success("Feed saved successfully!");

      // Add 5 credits to user if user data is available
      if (user && setUser) {
        const updatedUser = { ...user, credits: (user.credits || 0) + 5 };

        // Make sure you're updating the state properly
        setUser(updatedUser);

        // You can optionally store the updated user object in localStorage to persist across reloads
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Error while saving feed:", error);
    }
  };

  // Handle Share Feed
  const handleShare = async () => {
    try {
      const shareUrl = feed.url || window.location.href;
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");

      if (navigator.share) {
        await navigator.share({
          title: feed.title,
          text: feed.title,
          url: shareUrl,
        });
      }

      onShare(feed);
    } catch (error) {}
  };

  // Handle Report Feed using Local Storage
  const handleReport = () => {
    if (!reason.trim()) {
      toast.error("Please provide a reason for reporting");
      return;
    }

    // Get existing reports from localStorage
    const existingReports = JSON.parse(localStorage.getItem("reports")) || [];

    // Add the new report to the list
    const newReport = {
      feedId: feed._id || feed.id,
      reason,
      timestamp: new Date(),
    };

    // Save the report in localStorage
    existingReports.push(newReport);
    localStorage.setItem("reports", JSON.stringify(existingReports));

    toast.success("Report submitted successfully!");
    setReportReason("");
    setShowReportModal(false); // Close the modal after reporting
    onReport(feed, reason);
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden mb-4">
      <div className="p-4">
        <div className="flex items-center mb-2">
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
            <span className="text-gray-600 font-medium">
              {feed.author?.charAt(0) || "U"}
            </span>
          </div>
          <div>
            <h3 className="text-sm font-medium">{feed.author}</h3>
            <p className="text-xs text-gray-500">
              {new Date(feed.timestamp).toLocaleString()}
              {feed.source && (
                <span className="ml-2 bg-gray-100 px-2 py-0.5 rounded text-xs">
                  {feed.source}
                </span>
              )}
            </p>
          </div>
        </div>

        <h2 className="text-lg font-semibold mb-2">{feed.title}</h2>
        <p className="text-gray-700 mb-4">{feed.content}</p>

        {feed.image && (
          <div className="mb-4">
            <img
              src={feed.image || "/placeholder.svg"}
              alt={feed.title}
              className="w-full h-48 object-cover rounded"
            />
          </div>
        )}

        <div className="flex justify-between border-t pt-3">
          {/* Save Button */}
          <button
            onClick={handleSave}
            className={`text-sm flex items-center px-2 py-1 rounded ${
              saved
                ? "bg-blue-800 text-white hover:bg-blue-900" // Dark blue background for saved state
                : "text-blue-600 hover:text-blue-800"
            }`}
          >
            <svg
              className="h-4 w-4 mr-1"
              xmlns="http://www.w3.org/2000/svg"
              fill={saved ? "currentColor" : "none"}
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
            {saved ? "Saved" : "Save"}
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            <svg
              className="h-4 w-4 mr-1"
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
            Share
          </button>

          {/* Report Button */}
          <button
            onClick={() => setShowReportModal(true)}
            className="text-sm text-red-600 hover:text-red-800 flex items-center"
          >
            <svg
              className="h-4 w-4 mr-1"
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
            Report
          </button>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium mb-4">Report Feed</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for reporting this feed.
            </p>

            <textarea
              value={reason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 mb-4 h-24"
              placeholder="Enter reason for reporting..."
            ></textarea>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleReport}
                className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedCard;
