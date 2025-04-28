"use client"

import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import Navbar from "../components/Navbar"
import LoadingSpinner from "../components/LoadingSpinner"

const AdminReports = () => {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch reported feeds
    const fetchReports = async () => {
      try {
        // In a real app, this would be an API call
        // For demo, we'll use dummy data

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Get reported feeds from localStorage or use dummy data
        const storedReports = JSON.parse(localStorage.getItem("reportedFeeds") || "[]")

        const dummyReports = [
          {
            id: 1,
            feedId: 3,
            feedTitle: "Building a Personal Brand Online",
            reportedBy: "John Doe",
            reason: "This content is misleading and contains false information.",
            timestamp: new Date("2023-05-15T10:30:00").toISOString(),
            status: "pending",
          },
          {
            id: 2,
            feedId: 5,
            feedTitle: "Video Content Creation Tips",
            reportedBy: "Jane Smith",
            reason: "This content is copied from another creator without attribution.",
            timestamp: new Date("2023-05-14T14:45:00").toISOString(),
            status: "pending",
          },
          {
            id: 3,
            feedId: 2,
            feedTitle: "The Future of Social Media Marketing",
            reportedBy: "Michael Brown",
            reason: "This post contains inappropriate language.",
            timestamp: new Date("2023-05-13T09:15:00").toISOString(),
            status: "pending",
          },
        ]

        // Combine dummy reports with any stored reports
        const combinedReports = [...dummyReports]

        if (storedReports.length > 0) {
          storedReports.forEach((report, index) => {
            combinedReports.push({
              id: dummyReports.length + index + 1,
              feedId: report.feedId,
              feedTitle: `Feed #${report.feedId}`,
              reportedBy: "Current User",
              reason: report.reason,
              timestamp: report.timestamp,
              status: "pending",
            })
          })
        }

        setReports(combinedReports)
      } catch (error) {
        console.error("Error fetching reports:", error)
        toast.error("Failed to load reports. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])

  const handleDeleteFeed = (reportId) => {
    // In a real app, this would be an API call to delete the feed

    // Update the report status
    const updatedReports = reports.map((report) => {
      if (report.id === reportId) {
        return {
          ...report,
          status: "deleted",
        }
      }
      return report
    })

    setReports(updatedReports)
    toast.success("Feed deleted successfully")
  }

  const handleIgnoreReport = (reportId) => {
    // In a real app, this would be an API call to ignore the report

    // Update the report status
    const updatedReports = reports.map((report) => {
      if (report.id === reportId) {
        return {
          ...report,
          status: "ignored",
        }
      }
      return report
    })

    setReports(updatedReports)
    toast.success("Report ignored")
  }

  return (
    <div>
      <Navbar isAdmin={true} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">Reported Feeds</h2>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="large" />
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            {reports.length === 0 ? (
              <div className="px-4 py-5 text-center text-gray-500">No reported feeds found.</div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {reports.map((report) => (
                  <li key={report.id} className="px-4 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-start">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-gray-900">{report.feedTitle}</h3>
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              report.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : report.status === "deleted"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          Reported by: {report.reportedBy} on {new Date(report.timestamp).toLocaleString()}
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
  )
}

export default AdminReports
