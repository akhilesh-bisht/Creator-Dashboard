import axios from "axios";

// Axios instance
const api = axios.create({
  baseURL: "http://localhost:4500",
  withCredentials: true, // To ensure cookies are sent along with the request
});

// Set auth token for future requests
export const setAuthToken = (token) => {
  if (token) {
    // Set the Authorization header with the Bearer token
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    // If no token, remove the Authorization header
    delete api.defaults.headers.common["Authorization"];
  }
};

// 1- AUTH API FOR USER
export const registerUser = (data) => api.post("/api/auth/register", data);
export const loginUser = (email, password) =>
  api.post("/api/auth/login", { email, password });
export const logoutUser = () => api.post("/api/auth/logout");
export const updateProfile = (data) => api.patch("/api/auth/update", data);

// 2- ADMIN PANEL API
export const getAllUsers = async () => {
  const token = localStorage.getItem("token");
  return await api.get("/api/admin/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateUserCredits = (userId, credits) =>
  api.put(`/api/admin/user/credits/${userId}`, { credits });
export const deleteUser = (userId) => api.delete(`/api/admin/user/${userId}`);
export const getUserCredits = () => api.get("/api/admin/credits");

// 3- SAVED FEEDS
export const saveFeed = (data) => api.post("/api/feed/save", data);
export const getAllSavedFeeds = () => api.get("/api/feed/saved");
export const getSingleSavedFeed = (postId) =>
  api.get(`/api/feed/saved/${postId}`);
export const deleteSavedFeed = (postId) =>
  api.delete(`/api/feed/saved/${postId}`);

// 4- SHARING
export const shareFeed = (feedId) => api.post(`/api/feed/share/${feedId}`);

// 5- Fetch Feeds from External APIs
export const getRedditFeed = () => api.get("/api/posts/reddit");
export const getTwitterFeed = () => api.get("/api/posts/twitter");

// 6- REPORTING
export const reportFeed = (feedId, reason) =>
  api.post(`/api/report/${feedId}`, { reason });
export const getAllReportedFeeds = () => api.get("/api/report/all");
export const deleteReportedFeed = (feedId) =>
  api.delete(`/api/report/delete/${feedId}`);
export const ignoreReportedFeed = (feedId) =>
  api.put(`/api/report/ignore/${feedId}`);

export default api;
