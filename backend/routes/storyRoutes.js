const express = require("express");
const path = require("path");
const multer = require("multer");

const {
  createStory,
  getStories,
  getStoryById,
  getUserStories,
  updateStory,
  deleteStory,
  publishStory,
  approveStory,
  rejectStory,
  getPendingStories,
  getAllStoriesForAdmin,
  updateStoryStatus,
} = require("../controllers/storyController");

const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const { uploadAudio, uploadVideo } = require("../middlewares/multerMiddleware");
const { transcribeWithWhisper } = require("../controllers/transcriptionController");

const Story = require("../models/Story"); // ✅ Ensure Story model is imported
const router = express.Router();

// ✅ Upload Voice File
router.post(
  "/upload/audio",
  authMiddleware,
  uploadAudio.single("audio"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No audio file uploaded" });
    }
    res.status(200).json({ audioUrl: `/uploads/audio/${req.file.filename}` });
  }
);

// ✅ Upload Video File
router.post(
  "/upload/video",
  authMiddleware,
  uploadVideo.single("video"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No video file uploaded" });
    }
    res.status(200).json({ videoUrl: `/uploads/video/${req.file.filename}` });
  }
);

// ✅ Create Voice Story
router.post(
  "/voice",
  authMiddleware,
  uploadAudio.single("file"),
  (req, res) => {
    req.body.storyType = "voice";
    createStory(req, res);
  }
);

// ✅ Create Video Story
router.post(
  "/video",
  authMiddleware,
  uploadVideo.single("file"),
  (req, res) => {
    req.body.storyType = "video";
    createStory(req, res);
  }
);

// ✅ Create Text Story
router.post("/", authMiddleware, (req, res) => {
  req.body.storyType = "text";
  createStory(req, res);
});

// ✅ AI Audio Transcription
const storage = multer.diskStorage({
  destination: "uploads/audio",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now().toString() + ext;
    cb(null, name);
  },
});

const transcribeUpload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (![".mp3", ".wav", ".ogg"].includes(ext)) {
      return cb(new Error("Only audio files are allowed"), false);
    }
    cb(null, true);
  },
});

router.post("/transcribe", authMiddleware, transcribeUpload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No audio file uploaded." });

    const audioPath = req.file.path;
    const transcription = await new Promise((resolve, reject) => {
      transcribeWithWhisper({ file: { path: audioPath } }, {
        status: () => ({ json: resolve }),
      }, reject);
    });

    res.status(200).json({ transcription });
  } catch (err) {
    console.error("❌ Transcription error:", err);
    res.status(500).json({ message: "Whisper transcription failed." });
  }
});

// ✅ Increment views
router.post('/:id/increment-view', async (req, res) => {
  try {
    await Story.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ message: 'Failed to increment views' });
  }
});

// ✅ Increment shares with tracking
router.post('/:id/increment-share', authMiddleware, async (req, res) => {
  try {
    const { platform } = req.body;
    const userId = req.user?._id || null;

    await Story.findByIdAndUpdate(req.params.id, {
      $inc: { shares: 1 },
      $push: {
        sharedBy: {
          user: userId,
          platform: platform || "unknown",
          sharedAt: new Date(),
        }
      }
    });

    console.log(`✅ Story ${req.params.id} shared by ${userId || "anonymous"} via ${platform}`);
    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error incrementing shares:", err);
    res.status(500).json({ message: 'Failed to increment shares' });
  }
});

// ✅ User routes
router.get("/user", authMiddleware, getUserStories);

// ✅ Admin routes (⚠️ place before "/:id" to avoid conflict)
router.get("/admin/all", authMiddleware, adminMiddleware, getAllStoriesForAdmin);
router.get("/admin/pending", authMiddleware, adminMiddleware, getPendingStories);
router.put("/admin/:id/approve", authMiddleware, adminMiddleware, approveStory);
router.put("/admin/:id/reject", authMiddleware, adminMiddleware, rejectStory);

// ✅ New patch route for admin to update story status
router.patch("/:id/status", authMiddleware, adminMiddleware, updateStoryStatus);

// ✅ Public story routes
router.get("/", getStories);
router.get("/:id", getStoryById);

// ✅ Story modifications
router.put("/:id", authMiddleware, updateStory);
router.delete("/:id", authMiddleware, deleteStory);
router.put("/:id/publish", authMiddleware, publishStory);

module.exports = router;
