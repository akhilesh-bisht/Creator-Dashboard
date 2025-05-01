import { User } from "../models/user.model.js";

// Get All Users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select(
      "fullName email credits role createdAt lastLogin"
    );
    return res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

//  get all credits of user
export const getUserCredits = async (req, res) => {
  try {
    // Get the user ID from the authenticated user (JWT token decoded in `protect` middleware)
    const userId = req.user._id;

    // Find the user by their ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the user's credits
    return res.status(200).json({
      credits: user.credits,
    });
  } catch (error) {
    console.error("Get User Credits Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update User Credits (Admin only)
export const updateUserCredits = async (req, res) => {
  try {
    const { userId } = req.params; // Use `userId` from URL params
    const { credits } = req.body; // New credits from body

    console.log("Update User Credits:", userId, credits);

    // Validate input
    if (typeof credits !== "number" || credits < 0) {
      return res
        .status(400)
        .json({ error: "Credits must be a positive number." });
    }

    // Find user and update credits
    const user = await User.findById(userId); // Use `userId` here as well
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    user.credits = credits;
    await user.save();

    return res.status(200).json({ message: "Credits updated successfully." });
  } catch (error) {
    console.error("Update Credits Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete User (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
