import React from "react";
import { Navigate } from "react-router-dom";

// Private Route Component
export function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!token) return <Navigate to="/login" replace />;
  if (user.role?.toLowerCase() === "admin")
    return <Navigate to="/admin" replace />;

  return children;
}

// Admin Route Component
export function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!token) return <Navigate to="/login" replace />;
  if (user.role?.toLowerCase() !== "admin")
    return <Navigate to="/dashboard" replace />;

  return children;
}

// Dynamic Redirect Based on Role
export function RedirectBasedOnRole() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!token) return <Navigate to="/login" replace />;

  return user.role?.toLowerCase() === "admin" ? (
    <Navigate to="/admin" replace />
  ) : (
    <Navigate to="/dashboard" replace />
  );
}
