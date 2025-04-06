// backend/middlewares/multerMiddleware.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// AUDIO STORAGE
const audioStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "../uploads/audio");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// VIDEO STORAGE
const videoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "../uploads/video");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploadAudio = multer({ storage: audioStorage });
const uploadVideo = multer({ storage: videoStorage });

module.exports = {
  uploadAudio,
  uploadVideo,
};
