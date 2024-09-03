const User = require("../models/userModel");

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Only admins can create blogs." });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again later!" });
  }
};
