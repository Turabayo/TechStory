const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
      console.error("❌ No token provided.");
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id) {
      console.error("❌ Token is invalid, missing user ID.");
      return res.status(401).json({ message: "Token is not valid" });
    }

    if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
      console.error("❌ Invalid ObjectId format:", decoded.id);
      return res.status(400).json({ message: "Invalid user ID format in token." });
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      console.error("❌ User not found in database.");
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    console.log("✅ User authenticated:", user.email);
    next();
  } catch (error) {
    console.error("❌ Authentication error:", error.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};

// ✅ NEW: Admin-only middleware
const verifyAdmin = async (req, res, next) => {
  await authMiddleware(req, res, async () => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
  });
};

module.exports = authMiddleware;
module.exports.verifyAdmin = verifyAdmin;
