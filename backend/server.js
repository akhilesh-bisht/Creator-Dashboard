import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoute from "./routes/userRoute.js";
import connectDB from "./config/db.js";
import feedRoute from "./routes/feed.routes.js";
// Load environment variables
dotenv.config();

const app = express();

app.use(express.json());

// MongoDB connection
connectDB();

// Routes

//  authentication routes
app.use("/api/auth", userRoute);
//  feed routes
app.use("/api/feed", feedRoute);

app.get("/", (req, res) => {
  res.send("Server is running with import syntax!");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
