import { User } from "../models/user.model.js";

// Register User
export const registerUser = async (req, res) => {
  try {
    const { email, password, fullName, username } = req.body;

    // Validate input
    if (!email || !password || !fullName || !username) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) {
      return res
        .status(400)
        .json({ error: "User already exists. Please log in." });
    }

    // Validate password
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long." });
    }

    // Create new user with credits and profileCompletion flag
    const newUser = await User.create({
      email: normalizedEmail,
      password,
      fullName,
      username,
      credits: 0, // Initialize credits
      profileCompleted: false, // Initially false
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        email: newUser.email,
        username: newUser.username,
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

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check password
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Award credits for daily login
    const today = new Date();
    const lastLogin = user.lastLogin ? new Date(user.lastLogin) : null;
    const isNewDay = !lastLogin || lastLogin.getDate() !== today.getDate();

    if (isNewDay) {
      user.credits += 10; // Add credits for logging in daily
      user.lastLogin = today; // Update last login date
    }

    await user.save(); // Save user after updating credits

    // Generate access token
    const accessToken = user.generateAccessToken();

    // Set secure cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    return res.status(200).json({
      message: "User logged in successfully",
      user: { _id: user._id, email: user.email, credits: user.credits },
      accessToken,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Logout User
export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
