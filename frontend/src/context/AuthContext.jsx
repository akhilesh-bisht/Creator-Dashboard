"use client"

import { createContext, useState, useEffect } from "react"
import axios from "axios"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on initial load
    const token = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (token && storedUser) {
      setUser(JSON.parse(storedUser))
      // Set default axios auth header
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    }

    setLoading(false)
  }, [])

  // Login function
  const login = async (email, password) => {
    try {
      // In a real app, this would be an API call
      // For demo, we'll simulate a successful login
      const response = {
        data: {
          token: "fake-jwt-token-12345",
          user: {
            id: 1,
            fullName: "John Doe",
            username: "johndoe",
            email: email,
            credits: 100,
            isAdmin: email === "admin@example.com", // Make admin@example.com an admin user
          },
        },
      }

      // Save token and user to localStorage
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))

      // Set default axios auth header
      axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`

      // Update state
      setUser(response.data.user)

      return response.data
    } catch (error) {
      throw error
    }
  }

  // Register function
  const register = async (userData) => {
    try {
      // In a real app, this would be an API call
      // For demo, we'll simulate a successful registration
      const response = {
        data: {
          token: "fake-jwt-token-12345",
          user: {
            id: 1,
            fullName: userData.fullName,
            username: userData.username,
            email: userData.email,
            credits: 50,
            isAdmin: false,
          },
        },
      }

      // Save token and user to localStorage
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))

      // Set default axios auth header
      axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`

      // Update state
      setUser(response.data.user)

      return response.data
    } catch (error) {
      throw error
    }
  }

  // Logout function
  const logout = () => {
    // Remove token and user from localStorage
    localStorage.removeItem("token")
    localStorage.removeItem("user")

    // Remove axios auth header
    delete axios.defaults.headers.common["Authorization"]

    // Update state
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
}
