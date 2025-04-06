const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config(); // Load MONGO_URI from .env

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const users = await User.find({ role: { $exists: false } });

    for (const user of users) {
      user.role = "user";
      await user.save();
      console.log(`🔁 Updated ${user.email} to role: user`);
    }

    console.log("🎉 Role backfill complete");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

start();
