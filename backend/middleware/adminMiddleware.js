export const isAdmin = (req, res, next) => {
  const user = req.user; // Authenticated user (added by JWT middleware)

  if (user.role != "admin") {
    return res.status(403).json({ error: "Access denied. Admin only." });
  }

  next(); // Proceed to the next middleware/controller
};
