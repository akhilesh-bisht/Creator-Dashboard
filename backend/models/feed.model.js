import mongoose, { Schema } from "mongoose";

// Define Feed schema
const feedSchema = new Schema(
  {
    postId: {
      type: String,
      required: true,
      unique: true,
    },
    source: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    savedBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Reference to User model
        },
        savedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    reported: {
      type: Boolean,
      default: false,
    },
    reportReason: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Create Feed model
export const Feed = mongoose.model("Feed", feedSchema);
