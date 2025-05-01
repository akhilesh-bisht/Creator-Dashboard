import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoute from "./routes/userRoute.js";
import connectDB from "./config/db.js";
import feedRoute from "./routes/feed.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { protect } from "./middleware/authMiddleware.js";
import postsRoutes from "./routes/post.route.js";
import reportRoutes from "./routes/report.route.js";
// Load environment variables
dotenv.config();

const app = express();

app.use(express.json());

// MongoDB connection
connectDB();
const allowedOrigins = [
  "https://creator-dashboard-mocha.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // अगर origin undefined है (जैसे Postman से), तो उसे भी allow करें
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // ✅ allow credentials
  })
);

// app.use(
//   cors({
//     origin: "https://creator-dashboard-mocha.vercel.app",
//     credentials: true, // ✅ allow credentials
//   })
// );
// Routes

//  authentication routes
app.use("/api/auth", userRoute);
//  admin routes
app.use("/api/admin", protect, adminRoutes);
//  feed routes
app.use("/api/feed", protect, feedRoute);
//  posts routes
app.use("/api/posts", postsRoutes);
//  report routes
app.use("/api/report", reportRoutes);

app.get("/", (req, res) => {
  res.send("Server is running with import syntax!");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
