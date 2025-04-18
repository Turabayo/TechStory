// scripts/seed.js

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const Story = require("../models/Story");
const User = require("../models/User");

// ✅ Load environment variables
dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://iturabayo:tech2025@cluster0.bd8tgsr.mongodb.net/hertechstory?retryWrites=true&w=majority&appName=Cluster0";

const seedStories = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // ✅ Create test admin user if not exists
    const existingAdmin = await User.findOne({ email: "thealphamich@gmail.com" });
    let admin;
    if (!existingAdmin) {
      admin = await User.create({
        name: "Mich Admin",
        email: "thealphamich@gmail.com",
        password: "$2b$12$xUZMWW2qO4TdIdBLN3iDfurdJ6fUk3vmS14vMo/WChjOHLWK5enfG", // hashed "123"
        role: "admin",
        onboarded: true,
      });
      console.log("✅ Admin user created");
    } else {
      admin = existingAdmin;
    }

    // ✅ Fetch other seed users
    const users = await User.find({
      email: { $in: ["bayisengeodette9@gmail.com", "felixmurenzi07@gmail.com"] },
    });

    const sampleStories = [];

    // ✅ Admin stories (published)
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
