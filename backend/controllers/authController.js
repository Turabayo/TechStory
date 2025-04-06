const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Story = require("../models/Story");

// ✅ Register User
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
      onboarded: false,
    });

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("✅ Registered new user:", newUser.email);
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        onboarded: newUser.onboarded,
      },
    });
  } catch (error) {
    console.error("❌ Error registering user:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        onboarded: user.onboarded,
      },
    });
  } catch (error) {
    console.error("❌ Error during login:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Current Authenticated User
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      onboarded: user.onboarded,
    });
  } catch (error) {
    console.error("❌ Error in getMe:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Onboarding
exports.onboardUser = async (req, res) => {
  try {
    const { fullName, profession, skills, story } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.onboarded) return res.status(400).json({ message: "Already onboarded" });

    user.fullName = fullName?.trim() || user.name;
    user.profession = profession?.trim() || null;
    user.skills = skills?.filter((s) => s.trim() !== "") || [];
    user.story = story.trim();
    user.onboarded = true;
    await user.save();

    const defaultCategory = "Personal Growth";
    const existingStory = await Story.findOne({ user: userId });
    if (!existingStory) {
      const newStory = new Story({
        user: userId,
        title: `${user.fullName}'s Tech Journey`,
        content: story,
        storyType: "text",
        category: defaultCategory,
        location: "Unknown",
        views: 0,
        shares: 0,
        status: "published",
      });
      await newStory.save();
    }

    res.status(200).json({ message: "Onboarding successful", user });
  } catch (error) {
    console.error("❌ Error during onboarding:", error);
    res.status(500).json({ message: "Onboarding failed", error: error.message });
  }
};

// ✅ Admin: Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};

// ✅ Admin: Promote / Demote User
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role value" });
    }

    const user = await User.findByIdAndUpdate(id, { role }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User role updated successfully", user });
  } catch (error) {
    console.error("❌ Error updating role:", error);
    res.status(500).json({ message: "Failed to update role", error: error.message });
  }
};

// ✅ Admin: Delete User
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user", error: error.message });
  }
};
