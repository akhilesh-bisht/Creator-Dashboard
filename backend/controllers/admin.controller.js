import { User } from "../models/user.model.js";

// Get All Users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("fullName email credits role");
    return res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update User Credits (Admin only)
export const updateUserCredits = async (req, res) => {
  try {
    const { userId, credits } = req.body;

    if (!userId || credits === undefined) {
      return res
        .status(400)
        .json({ error: "User ID and credits are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.credits = credits;
    await user.save();

    return res
      .status(200)
      .json({ message: "Credits updated successfully", user });
  } catch (error) {
    console.error("Error updating credits:", error);
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
