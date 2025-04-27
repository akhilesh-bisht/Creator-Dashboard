import { User } from "../models/user.model.js";

// Register User
export const registerUser = async (req, res) => {
  try {
    const { email, password, fullName, username, role } = req.body;

    // Validate input
    if (!email || !password || !fullName || !username) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res
        .status(400)
        .json({ error: "User already exists. Please log in." });
    }

    // Validate password length
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long." });
    }

    // Create new user
    const newUser = await User.create({
      email: normalizedEmail,
      password,
      fullName,
      username,
      role, // optional (by default schema mein "User" hai)
      credits: 0, // optional: schema mein bhi default hai
      profileCompleted: false, // optional: schema mein bhi default hai
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ error: "Invalid email or password." });
    }

    // Verify password
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Handle daily login bonus
    const today = new Date();
    const lastLogin = user.lastLogin ? new Date(user.lastLogin) : null;
    const isNewDay =
      !lastLogin || today.toDateString() !== lastLogin.toDateString();

    if (isNewDay) {
      user.credits += 10; // bonus credits
      user.lastLogin = today;
      await user.save();
    }

    // Generate token
    const accessToken = user.generateAccessToken();

    // Send token in cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only secure cookies in production
      sameSite: "Strict",
    });

    res.status(200).json({
      message: "User logged in successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
        credits: user.credits,
      },
      accessToken,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Logout User
export const logoutUser = (req, res) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update User Profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming protect middleware sets req.user
    const { fullName, username, email } = req.body;

    // Validate fields
    if (!fullName && !username && !email) {
      return res
        .status(400)
        .json({ error: "At least one field is required to update." });
    }

    const updates = {};

    if (fullName) updates.fullName = fullName;
    if (username) updates.username = username;
    if (email) updates.email = email.toLowerCase().trim();

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password"); // password hide karke bhejna

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
