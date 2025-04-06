const mongoose = require("mongoose");
const Story = require("../models/Story");
const path = require("path");
const { transcribeWithWhisper } = require("./transcriptionController");

// ✅ Create a new story (Text, Voice, Video)
const createStory = async (req, res) => {
  try {
    const {
      title,
      content,
      storyType,
      audioUrl,
      videoUrl,
      location,
      coordinates,
      category,
      status,
    } = req.body;

    let transcription = "";
    let finalAudioUrl = audioUrl;
    let finalVideoUrl = videoUrl;

    if (storyType === "voice" && req.file) {
      try {
        const audioPath = path.join("uploads", "audio", req.file.filename);
        transcription = await transcribeWithWhisper(audioPath);
        finalAudioUrl = audioPath;
      } catch (err) {
        console.error("⚠️ Error during Whisper transcription:", err);
        return res.status(500).json({ message: "Failed to transcribe audio", error: err });
      }
    }

    if (storyType === "video" && req.file) {
      finalVideoUrl = path.join("uploads", "video", req.file.filename);
    }

    const finalStatus = req.user.role === "admin" ? (status || "published") : "pending";

    const newStory = new Story({
      title,
      content: transcription || content,
      storyType,
      audioUrl: storyType === "voice" ? finalAudioUrl : "",
      videoUrl: storyType === "video" ? finalVideoUrl : "",
      transcription,
      location,
      category,
      coordinates: coordinates?.coordinates?.length === 2
        ? {
            type: "Point",
            coordinates: [coordinates.coordinates[0], coordinates.coordinates[1]],
          }
        : undefined,
      user: req.user.id,
      status: finalStatus,
    });

    await newStory.save();
    res.status(201).json({ message: "Story created successfully", story: newStory });
  } catch (error) {
    console.error("❌ Error creating story:", error);
    res.status(500).json({ message: "Error creating story", error: error.message });
  }
};

// ✅ Fetch all published stories (Public)
const getStories = async (req, res) => {
  try {
    const stories = await Story.find({ status: "published" }).sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    console.error("❌ Error fetching stories:", error);
    res.status(500).json({ message: "Error fetching stories", error: error.message });
  }
};

// ✅ Fetch story by ID
const getStoryById = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: "Story not found" });
    res.json(story);
  } catch (error) {
    console.error("❌ Error fetching story:", error);
    res.status(500).json({ message: "Error fetching story", error: error.message });
  }
};

// ✅ Get stories by logged-in user
const getUserStories = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format." });
    }

    const stories = await Story.find({ user: userId }).sort({ createdAt: -1 });
    if (!stories || stories.length === 0) {
      return res.status(404).json({ message: "No stories found for this user." });
    }

    res.status(200).json(stories);
  } catch (error) {
    console.error("❌ Error fetching user stories:", error);
    res.status(500).json({ message: "Error fetching user stories", error: error.message });
  }
};

// ✅ Update story
const updateStory = async (req, res) => {
  try {
    const { title, content, category, status } = req.body;
    const story = await Story.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title, content, category, status },
      { new: true }
    );

    if (!story) return res.status(404).json({ message: "Story not found" });
    res.json({ message: "Story updated successfully", story });
  } catch (error) {
    console.error("❌ Error updating story:", error);
    res.status(500).json({ message: "Error updating story", error: error.message });
  }
};

// ✅ Delete story
const deleteStory = async (req, res) => {
  try {
    const isAdmin = req.user.role === "admin";
    const userId = req.user.id;

    const query = isAdmin
      ? { _id: req.params.id } // Admins can delete any
      : { _id: req.params.id, user: userId }; // Users can only delete their own

    const story = await Story.findOneAndDelete(query);

    if (!story) {
      return res.status(404).json({ message: "Story not found or not authorized" });
    }

    res.status(200).json({ message: "Story deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting story:", error);
    res.status(500).json({ message: "Error deleting story", error: error.message });
  }
};

// ✅ Publish story (manually)
const publishStory = async (req, res) => {
  try {
    const story = await Story.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { status: "published" },
      { new: true }
    );

    if (!story) return res.status(404).json({ message: "Story not found" });
    res.json({ message: "Story published successfully", story });
  } catch (error) {
    console.error("❌ Error publishing story:", error);
    res.status(500).json({ message: "Error publishing story", error: error.message });
  }
};

// ✅ Get all pending stories (admin only)
const getPendingStories = async (req, res) => {
  try {
    const pending = await Story.find({ status: "pending" }).sort({ createdAt: -1 });
    res.status(200).json(pending);
  } catch (error) {
    console.error("❌ Error fetching pending stories:", error);
    res.status(500).json({ message: "Failed to fetch pending stories", error: error.message });
  }
};

// ✅ Approve story
const approveStory = async (req, res) => {
  try {
    const story = await Story.findByIdAndUpdate(
      req.params.id,
      { status: "published" },
      { new: true }
    );

    if (!story) return res.status(404).json({ message: "Story not found" });
    res.status(200).json({ message: "Story approved and published", story });
  } catch (error) {
    console.error("❌ Error approving story:", error);
    res.status(500).json({ message: "Failed to approve story", error: error.message });
  }
};

// ✅ Reject story
const rejectStory = async (req, res) => {
  try {
    const story = await Story.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    if (!story) return res.status(404).json({ message: "Story not found" });
    res.status(200).json({ message: "Story rejected", story });
  } catch (error) {
    console.error("❌ Error rejecting story:", error);
    res.status(500).json({ message: "Failed to reject story", error: error.message });
  }
};

// ✅ Get all stories (admin only)
const getAllStoriesForAdmin = async (req, res) => {
  try {
    const stories = await Story.find().sort({ createdAt: -1 }).populate("user", "name email");
    res.status(200).json(stories);
  } catch (error) {
    console.error("❌ Error fetching all stories for admin:", error);
    res.status(500).json({ message: "Failed to fetch all stories", error: error.message });
  }
};

// ✅ PATCH route: Update story status
const updateStoryStatus = async (req, res) => {
  try {
    console.log("🔍 Incoming status body:", req.body); // ✅ Debug print
    let status = req.body.status;

    // Normalize and trim
    if (typeof status !== "string") {
      return res.status(400).json({ error: "Status must be a string" });
    }

    status = status.trim().toLowerCase();
    console.log("✅ Normalized status:", status);

    const allowed = ["pending", "published", "rejected"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: "Invalid status", received: status });
    }

    const story = await Story.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!story) {
      return res.status(404).json({ error: "Story not found" });
    }

    res.status(200).json({ message: `Story status updated to ${status}`, story });
  } catch (error) {
    console.error("❌ Error updating story status:", error);
    res.status(500).json({ message: "Failed to update story status", error: error.message });
  }
};

// ✅ Export all
module.exports = {
  createStory,
  getStories,
  getStoryById,
  getUserStories,
  updateStory,
  deleteStory,
  publishStory,
  getPendingStories,
  approveStory,
  rejectStory,
  getAllStoriesForAdmin,
  updateStoryStatus,
};
