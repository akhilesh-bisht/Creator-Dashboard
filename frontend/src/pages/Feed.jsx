"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import Navbar from "../components/Navbar"
import FeedCard from "../components/FeedCard"
import LoadingSpinner from "../components/LoadingSpinner"
import { getRedditFeed, getTwitterFeed, saveFeed, reportFeed, shareFeed, deleteSavedFeed } from "../services/api"
import { toast } from "react-toastify"

const Feed = () => {
  const { user } = useContext(AuthContext)
  const [feeds, setFeeds] = useState([])
  const [loading, setLoading] = useState(true)
  const [feedSource, setFeedSource] = useState("all") // "all", "reddit", "twitter"
  const [savedFeedIds, setSavedFeedIds] = useState([])

  useEffect(() => {
    // Fetch feeds based on selected source
    fetchFeeds()
  }, [feedSource])

  const fetchFeeds = async () => {
    try {
      setLoading(true)

      let combinedFeeds = []

      if (feedSource === "all" || feedSource === "reddit") {
        const redditResponse = await getRedditFeed()
        combinedFeeds = [...combinedFeeds, ...redditResponse.data]
      }

      if (feedSource === "all" || feedSource === "twitter") {
        const twitterResponse = await getTwitterFeed()
        combinedFeeds = [...combinedFeeds, ...twitterResponse.data]
      }

      // Sort by timestamp (newest first)
      combinedFeeds.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

      setFeeds(combinedFeeds)

      // Get saved feed IDs from localStorage or API
      // For now, we'll use localStorage as a temporary solution
      const savedFeeds = JSON.parse(localStorage.getItem("savedFeeds") || "[]")
      setSavedFeedIds(savedFeeds)
    } catch (error) {
      console.error("Error fetching feeds:", error)
      toast.error("Failed to load feeds. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveFeed = async (feed) => {
    try {
      // Check if already saved
      const isSaved = savedFeedIds.includes(feed.id)

      if (isSaved) {
        // Remove from saved feeds
        await deleteSavedFeed(feed.id)
        const updatedSavedFeedIds = savedFeedIds.filter((id) => id !== feed.id)
        setSavedFeedIds(updatedSavedFeedIds)
        localStorage.setItem("savedFeeds", JSON.stringify(updatedSavedFeedIds))
        toast.success("Feed removed from saved items")
      } else {
        // Add to saved feeds
        await saveFeed({
          feedId: feed.id,
          title: feed.title,
          content: feed.content,
          author: feed.author,
          source: feed.source || "unknown",
          image: feed.image || null,
        })
        const updatedSavedFeedIds = [...savedFeedIds, feed.id]
        setSavedFeedIds(updatedSavedFeedIds)
        localStorage.setItem("savedFeeds", JSON.stringify(updatedSavedFeedIds))
        toast.success("Feed saved successfully")
      }
    } catch (error) {
      console.error("Error saving/removing feed:", error)
      toast.error("Failed to save/remove feed. Please try again.")
    }
  }

  const handleShareFeed = async (feed) => {
    try {
      await shareFeed(feed.id)

      // In a real app, this would use the Web Share API or copy to clipboard
      navigator.clipboard.writeText(`https://example.com/feed/${feed.id}`)
      toast.success("Link copied to clipboard!")
    } catch (error) {
      console.error("Error sharing feed:", error)
      toast.error("Failed to share feed. Please try again.")
    }
  }

  const handleReportFeed = async (feed, reason) => {
    try {
      await reportFeed(feed.id, reason)
      toast.success("Feed reported successfully")
    } catch (error) {
      console.error("Error reporting feed:", error)
      toast.error("Failed to report feed. Please try again.")
    }
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">Feed</h2>
            <p className="mt-1 text-sm text-gray-500">Discover content from creators around the world</p>
          </div>

          <div className="mt-4 md:mt-0">
            <div className="inline-flex rounded-md shadow-sm">
              <button
                onClick={() => setFeedSource("all")}
                className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                  feedSource === "all" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
                } border border-gray-300`}
              >
                All
              </button>
              <button
                onClick={() => setFeedSource("reddit")}
                className={`px-4 py-2 text-sm font-medium ${
                  feedSource === "reddit" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
                } border-t border-b border-gray-300`}
              >
                Reddit
              </button>
              <button
                onClick={() => setFeedSource("twitter")}
                className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                  feedSource === "twitter" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
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
                No feeds available. Try a different source or check back later.
              </div>
            ) : (
              feeds.map((feed) => (
                <FeedCard
                  key={feed.id}
                  feed={feed}
                  onSave={() => handleSaveFeed(feed)}
                  onShare={() => handleShareFeed(feed)}
                  onReport={handleReportFeed}
                  isSaved={savedFeedIds.includes(feed.id)}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Feed
