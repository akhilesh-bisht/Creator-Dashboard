"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import Navbar from "../components/Navbar"
import FeedCard from "../components/FeedCard"
import LoadingSpinner from "../components/LoadingSpinner"
import { toast } from "react-toastify"

const Feed = () => {
  const { user } = useContext(AuthContext)
  const [feeds, setFeeds] = useState([])
  const [loading, setLoading] = useState(true)
  const [savedFeedIds, setSavedFeedIds] = useState([])

  useEffect(() => {
    // Simulate API call to fetch feeds
    const fetchFeeds = async () => {
      try {
        // In a real app, this would be an API call
        // For demo, we'll use dummy data

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        const dummyFeeds = [
          {
            id: 1,
            title: "How to Optimize Your Content Strategy",
            content:
              "Learn the best practices for content optimization in 2023. This comprehensive guide covers everything from SEO to social media distribution strategies.",
            author: "Jane Smith",
            timestamp: new Date("2023-05-15T10:30:00").toISOString(),
            image:
              "https://images.unsplash.com/photo-1504639725590-34d0984388bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          },
          {
            id: 2,
            title: "The Future of Social Media Marketing",
            content:
              "Discover emerging trends in social media that will shape the future of digital marketing. From AI-powered content creation to immersive AR experiences.",
            author: "Mark Johnson",
            timestamp: new Date("2023-05-10T14:20:00").toISOString(),
            image:
              "https://images.unsplash.com/photo-1611162616475-46b635cb6868?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          },
          {
            id: 3,
            title: "Building a Personal Brand Online",
            content:
              "Step-by-step guide to establishing your personal brand in the digital space. Learn how to stand out in a crowded market and attract your ideal audience.",
            author: "Sarah Williams",
            timestamp: new Date("2023-05-08T09:45:00").toISOString(),
            image:
              "https://images.unsplash.com/photo-1493612276216-ee3925520721?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          },
          {
            id: 4,
            title: "Monetization Strategies for Content Creators",
            content:
              "Explore various ways to monetize your content and build sustainable revenue streams. From sponsorships to digital products and subscription models.",
            author: "David Chen",
            timestamp: new Date("2023-05-05T16:10:00").toISOString(),
            image:
              "https://images.unsplash.com/photo-1553729459-efe14ef6055d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          },
          {
            id: 5,
            title: "Video Content Creation Tips",
            content:
              "Master the art of video content creation with these professional tips. Learn about equipment, lighting, editing, and distribution to maximize engagement.",
            author: "Emily Rodriguez",
            timestamp: new Date("2023-05-03T11:25:00").toISOString(),
            image:
              "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          },
        ]

        // Get saved feed IDs from localStorage
        const savedFeeds = JSON.parse(localStorage.getItem("savedFeeds") || "[]")
        setSavedFeedIds(savedFeeds)

        setFeeds(dummyFeeds)
      } catch (error) {
        console.error("Error fetching feeds:", error)
        toast.error("Failed to load feeds. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchFeeds()
  }, [])

  const handleSaveFeed = (feed) => {
    // Check if already saved
    const isSaved = savedFeedIds.includes(feed.id)

    if (isSaved) {
      // Remove from saved feeds
      const updatedSavedFeedIds = savedFeedIds.filter((id) => id !== feed.id)
      setSavedFeedIds(updatedSavedFeedIds)
      localStorage.setItem("savedFeeds", JSON.stringify(updatedSavedFeedIds))
      toast.success("Feed removed from saved items")
    } else {
      // Add to saved feeds
      const updatedSavedFeedIds = [...savedFeedIds, feed.id]
      setSavedFeedIds(updatedSavedFeedIds)
      localStorage.setItem("savedFeeds", JSON.stringify(updatedSavedFeedIds))
      toast.success("Feed saved successfully")
    }
  }

  const handleReportFeed = (feed, reason) => {
    // In a real app, this would be an API call to report the feed
    console.log("Reporting feed:", feed.id, "Reason:", reason)

    // For demo, we'll just show a success message
    toast.success("Feed reported successfully")

    // Add to reported feeds in localStorage
    const reportedFeeds = JSON.parse(localStorage.getItem("reportedFeeds") || "[]")
    const updatedReportedFeeds = [...reportedFeeds, { feedId: feed.id, reason, timestamp: new Date().toISOString() }]
    localStorage.setItem("reportedFeeds", JSON.stringify(updatedReportedFeeds))
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
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="large" />
          </div>
        ) : (
          <div>
            {feeds.map((feed) => (
              <FeedCard key={feed.id} feed={feed} onSave={() => handleSaveFeed(feed)} onReport={handleReportFeed} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Feed
