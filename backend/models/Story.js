const mongoose = require("mongoose");

const StorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: String },
    storyType: { type: String, enum: ["text", "voice", "video"], required: true },
    audioUrl: { type: String },
    videoUrl: { type: String },
    transcription: { type: String },
    category: {
      type: String,
      enum: [
        "Entrepreneurship",
        "Education",
        "Overcoming Barriers",
        "Innovation",
        "Personal Growth",
        "AI",
        "Web Dev",
        "Mobile Dev",
        "Cyber Security",
        "Data Science",
        "Other"
      ],
      required: true,
      default: "Education"
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    location: { type: String },
    coordinates: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0]
      },
    },
    views: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    sharedBy: [
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    platform: { type: String },
    sharedAt: { type: Date, default: Date.now }
  }
],
    status: {
      type: String,
      enum: ["pending", "published", "rejected"],
      default: "pending"
    }
  },
  { timestamps: true }
);

StorySchema.index({ coordinates: "2dsphere" });

module.exports = mongoose.model("Story", StorySchema);
