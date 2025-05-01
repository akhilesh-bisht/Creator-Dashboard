"use client";

import { createContext, useState, useEffect } from "react";
import {
  loginUser,
  registerUser,
  logoutUser,
  setAuthToken,
} from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on initial load
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      // Set auth token for future requests
      setAuthToken(token);
    }

    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await loginUser(email, password);

      // Save token and user to localStorage
      localStorage.setItem("token", response.data.accessToken);
      console.log(response.data.accessToken);
      console.log(response.data.credits);

      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Set auth token for future requests
      setAuthToken(response.data.token);

      // Update state
      setUser(response.data.user);
      console.log(user);

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await registerUser(userData);

      // Save token and user to localStorage
      localStorage.setItem("token", response.data.accessToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Set auth token for future requests
      setAuthToken(response.data.token);

      // Update state
      setUser(response.data.user);

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await logoutUser();

      // Remove token and user from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Remove auth token
      setAuthToken(null);

      // Update state
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);

      // Even if the API call fails, clear local storage and state
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setAuthToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
