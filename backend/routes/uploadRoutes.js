// routes/uploadRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middleware/multerMiddleware");
const path = require("path");

router.post("/audio", upload.single("audio"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No audio file uploaded" });
  const audioUrl = `/uploads/audio/${req.file.filename}`;
  res.status(200).json({ message: "Audio uploaded", audioUrl });
});

router.post("/video", upload.single("video"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No video file uploaded" });
  const videoUrl = `/uploads/video/${req.file.filename}`;
  res.status(200).json({ message: "Video uploaded", videoUrl });
});

module.exports = router;
