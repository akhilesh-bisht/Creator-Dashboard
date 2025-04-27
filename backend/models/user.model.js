import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Define User schema
const userSchema = new Schema(
  {
    fullName: { type: String, required: true },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },

    //  Extra fields for your project
    role: { type: String, enum: ["User", "Admin"], default: "User" },
    credits: { type: Number, default: 0 },
    savedFeeds: [
      {
        postId: { type: String, required: true },
        source: { type: String },
        title: { type: String },
        url: { type: String },
        savedAt: { type: Date, default: Date.now },
      },
    ],
    lastLogin: { type: Date }, // for daily login bonus
    profileCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare entered password with hashed password
userSchema.methods.isPasswordCorrect = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Generate JWT access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email, role: this.role }, // include role in token
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1h" }
  );
};

// Export the User model
export const User = mongoose.model("User", userSchema);
