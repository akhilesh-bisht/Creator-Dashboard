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
import fs from "fs";
import https from "https";

// Load environment variables
dotenv.config();

const app = express();

// Body parser middleware
app.use(express.json());

// MongoDB connection
connectDB();

const allowedOrigins = [
  "https://creator-dashboard-mocha.vercel.app",
  "http://localhost:5173",
];

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  })
);

// Routes
app.use("/api/auth", userRoute);
app.use("/api/admin", protect, adminRoutes);
app.use("/api/feed", protect, feedRoute);
app.use("/api/posts", postsRoutes);
app.use("/api/report", reportRoutes);

app.get("/", (req, res) => {
  res.send("Server is running with import syntax!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Something went wrong on the server." });
});

// Start server
const PORT = process.env.PORT || 5000;

// In production, use HTTPS
if (process.env.NODE_ENV === "production") {
  const privateKey = fs.readFileSync("path/to/private.key", "utf8");
  const certificate = fs.readFileSync("path/to/certificate.crt", "utf8");
  const ca = fs.readFileSync("path/to/ca.pem", "utf8");

  const credentials = { key: privateKey, cert: certificate, ca: ca };

  https.createServer(credentials, app).listen(PORT, () => {
    console.log(`Server running securely at https://localhost:${PORT}`);
  });
} else {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}
