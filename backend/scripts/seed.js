// scripts/seed.js

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Story = require("../models/Story");
const User = require("../models/User");

// ✅ Load .env config
dotenv.config();

// ✅ MongoDB Atlas connection string (from environment)
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://iturabayo:tech2025@cluster0.bd8tgsr.mongodb.net/hertechstory?retryWrites=true&w=majority&appName=Cluster0";

const seedStories = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // ✅ Find seed users
    const admins = await User.find({
      email: { $in: ["thealphamich@gmail.com", "turabayoimmacule@gmail.com"] },
    });

    const users = await User.find({
      email: { $in: ["bayisengeodette9@gmail.com", "felixmurenzi07@gmail.com"] },
    });

    const sampleStories = [];

    // ✅ Admin stories (published)
    admins.forEach((admin) => {
      sampleStories.push({
        user: admin._id,
        title: "Admin Video Insight",
        storyType: "video",
        videoUrl: "/uploads/video/sample_admin.mp4",
        transcription: "This is a powerful story about leadership in tech.",
        category: "Innovation",
        location: "Admin HQ",
        coordinates: { type: "Point", coordinates: [30.0589, -1.9499] },
        views: 100,
        shares: 10,
        status: "published",
      });
    });

    // ✅ User stories (pending)
    users.forEach((user) => {
      sampleStories.push(
        {
          user: user._id,
          title: "Pending Voice Story",
          storyType: "voice",
          audioUrl: "/uploads/audio/sample_user.mp3",
          transcription: "A story waiting to be approved by an admin.",
          category: "Personal Growth",
          location: "Kigali",
          coordinates: { type: "Point", coordinates: [30.0588, -1.94995] },
          views: 0,
          shares: 0,
          status: "pending",
        },
        {
          user: user._id,
          title: "User Journey in Tech",
          storyType: "text",
          content: "This is a written story about my tech journey.",
          category: "Education",
          location: "Remote",
          coordinates: { type: "Point", coordinates: [30.1, -1.9] },
          views: 0,
          shares: 0,
          status: "pending",
        }
      );
    });

    await Story.insertMany(sampleStories);
    console.log("✅ Seeded sample stories!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding stories:", error);
    process.exit(1);
  }
};

seedStories();
