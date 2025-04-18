// backend/controllers/seedController.js
const Story = require("../models/Story");
const User = require("../models/User");

exports.seedDatabase = async (req, res) => {
  try {
    const admins = await User.find({
      email: { $in: ["thealphamich@gmail.com", "turabayoimmacule@gmail.com"] },
    });

    const users = await User.find({
      email: { $in: ["bayisengeodette9@gmail.com", "felixmurenzi@gmail.com"] },
    });

    const sampleStories = [];

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
    return res.status(200).json({ message: "✅ Database seeded with sample stories!" });
  } catch (error) {
    console.error("❌ Error seeding stories:", error);
    return res.status(500).json({ error: "Seeding failed" });
  }
};
