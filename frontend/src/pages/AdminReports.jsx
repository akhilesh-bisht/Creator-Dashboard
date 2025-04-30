"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  getAllReportedFeeds,
  deleteReportedFeed,
  ignoreReportedFeed,
} from "../services/api";

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await getAllReportedFeeds();

      if (Array.isArray(response.data.feeds)) {
        console.log("Fetched feeds:", response.data.feeds);

        // Normalize data based on the provided response structure
        const normalizedReports = response.data.feeds.map((feed) => ({
          id: feed._id,
          feedTitle: feed.title || "Untitled",
          reportedBy: feed.reported || "Unknown",
          timestamp: feed.createdAt || Date.now(),
          reason: feed.reportReason || "No reason provided",
          status: feed.reported ? "pending" : "resolved",
        }));

        setReports(normalizedReports);
      } else {
        console.error("Invalid data format: Expected feeds array.");
        toast.error("Unexpected data format. Please try again later.");
      }
    } catch (error) {
      const errorMsg = error.response
        ? error.response.data.message
        : "Failed to load reports. Please try again later.";
      console.error("Error fetching reports:", error);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFeed = async (reportId) => {
    try {
      await deleteReportedFeed(reportId);
      const updatedReports = reports.map((report) =>
        report.id === reportId ? { ...report, status: "deleted" } : report
      );
      setReports(updatedReports);
      toast.success("Feed deleted successfully");
    } catch (error) {
      console.error("Error deleting feed:", error);
      toast.error("Failed to delete feed. Please try again.");
    }
  };

  const handleIgnoreReport = async (reportId) => {
    try {
      await ignoreReportedFeed(reportId);
      const updatedReports = reports.map((report) =>
        report.id === reportId ? { ...report, status: "ignored" } : report
      );
      setReports(updatedReports);
      toast.success("Report ignored");
    } catch (error) {
      console.error("Error ignoring report:", error);
      toast.error("Failed to ignore report. Please try again.");
    }
  };

  return (
    <div>
      <Navbar isAdmin={true} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Reported Feeds
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="large" />
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            {reports.length === 0 ? (
              <div className="px-4 py-5 text-center text-gray-500">
                No reported feeds found.
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {reports.map((report) => (
                  <li key={report.id} className="px-4 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-start">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-gray-900">
                            {report.feedTitle}
                          </h3>
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              report.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : report.status === "deleted"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {report.status
                              ? report.status.charAt(0).toUpperCase() +
                                report.status.slice(1)
                              : "Unknown"}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          Reported by: {report.reportedBy} on{" "}
                          {new Date(report.timestamp).toLocaleString()}
                        </p>
                        <div className="mt-2 bg-gray-50 p-3 rounded-md">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Reason: </span>
                            {report.reason}
                          </p>
                        </div>
                      </div>

                      {report.status === "pending" && (
                        <div className="mt-4 sm:mt-0 sm:ml-6 flex flex-col space-y-2">
                          <button
                            onClick={() => handleDeleteFeed(report.id)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Delete Feed
                          </button>
                          <button
                            onClick={() => handleIgnoreReport(report.id)}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Ignore Report
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReports;
