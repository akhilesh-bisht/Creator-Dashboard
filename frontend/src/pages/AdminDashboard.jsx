"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";
import { getAllUsers, getAllReportedFeeds } from "../services/api";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);

      const [usersResponse, reportsResponse] = await Promise.all([
        getAllUsers(),
        getAllReportedFeeds(),
      ]);

      const users = Array.isArray(usersResponse?.data?.users)
        ? usersResponse.data.users
        : [];

      let reports = [];

      if (Array.isArray(reportsResponse?.data?.reports)) {
        reports = reportsResponse.data.reports;
      } else if (Array.isArray(reportsResponse?.data)) {
        reports = reportsResponse.data;
      } else {
        console.warn("Unexpected reports format:", reportsResponse?.data);
      }

      const totalCreditsIssued = users.reduce(
        (total, user) => total + (user.credits || 0),
        0
      );

      const dummyStats = {
        totalUsers: users.length,
        newUsersToday: 0, // placeholder
        totalFeeds: 0, // placeholder
        reportedFeeds: reports.length,
        totalCreditsIssued,
      };

      setStats(dummyStats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      toast.error("Failed to load admin dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div>
        <Navbar isAdmin={true} />
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
      <Navbar isAdmin={true} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Admin Dashboard
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* Total Users Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Users
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {stats.totalUsers}
                </dd>
                <dd className="mt-2 text-sm text-green-600">
                  +{stats.newUsersToday} today
                </dd>
              </dl>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <Link
                to="/admin/users"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                View all users
              </Link>
            </div>
          </div>

          {/* Total Feeds Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Feeds
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {stats.Feeds}
                </dd>
                <dd className="mt-2 text-sm text-red-600">
                  {stats.reportedFeeds} reported
                </dd>
              </dl>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <Link
                to="/admin/reports"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                View reported feeds
              </Link>
            </div>
          </div>

          {/* Total Credits Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Credits Issued
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {stats.totalCreditsIssued}
                </dd>
                <dd className="mt-2 text-sm text-gray-600">Across all users</dd>
              </dl>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <Link
                to="/admin/users"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Manage credits
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Quick Actions
            </h3>
          </div>
          <div className="border-t border-gray-200 p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/admin/users"
              className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center">
                <svg
                  className="h-6 w-6 text-blue-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <span className="text-gray-700 font-medium">Manage Users</span>
              </div>
            </Link>

            <Link
              to="/admin/reports"
              className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center">
                <svg
                  className="h-6 w-6 text-red-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span className="text-gray-700 font-medium">
                  Review Reports
                </span>
              </div>
            </Link>

            <Link
              to="/admin/users"
              className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center">
                <svg
                  className="h-6 w-6 text-green-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-gray-700 font-medium">
                  Manage Credits
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              System Status
            </h3>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  API Status
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Operational
                  </span>
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Database Status
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Operational
                  </span>
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Last Deployment
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date().toLocaleString()}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  System Version
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  v1.2.0
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
