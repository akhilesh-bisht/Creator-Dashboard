import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      req.user = await User.findById(decoded._id).select("-password"); // <-- fix here

      next();
    } catch (err) {
      return res
        .status(401)
        .json({ message: "Not authorized, token failed", token });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};
