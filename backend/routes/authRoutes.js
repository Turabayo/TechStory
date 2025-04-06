const express = require("express");
const passport = require("passport");
const {
  registerUser,
  loginUser,
  getMe,
  googleAuth,
  onboardUser,
  getAllUsers,
  updateUserRole,
  deleteUser,
} = require("../controllers/authController");

const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const Story = require("../models/Story");

const router = express.Router();

// ✅ Public Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// ✅ Authenticated User Info
router.get("/me", authMiddleware, getMe);

// ✅ Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000",
    failureRedirect: "/login",
  })
);

// ✅ Onboarding Route
router.post("/onboard", authMiddleware, onboardUser);

// ✅ Fetch stories for logged-in user (with stats)
router.get("/stories", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const stories = await Story.find({ user: userId });

    res.json({
      stories,
      totalStories: stories.length,
      totalComments: stories.reduce((sum, story) => sum + (story.comments?.length || 0), 0),
      totalViews: stories.reduce((sum, story) => sum + (story.views || 0), 0),
      totalShares: stories.reduce((sum, story) => sum + (story.shares || 0), 0),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Admin-only Routes
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);
router.patch("/users/:id/role", authMiddleware, adminMiddleware, updateUserRole);
router.delete("/users/:id", authMiddleware, adminMiddleware, deleteUser);

module.exports = router;
