const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

exports.transcribeWithWhisper = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  const audioPath = path.join(__dirname, "..", req.file.path);
  const outputDir = path.join(__dirname, "..", "uploads", "audio");
  const outputFile = path.join(
    outputDir,
    path.basename(audioPath, path.extname(audioPath)) + ".txt"
  );

  const command = `"C:\\Users\\hp\\AppData\\Local\\Programs\\Python\\Python313\\python.exe" -m whisper "${audioPath}" --language en --task transcribe --output_format txt --output_dir "${outputDir}"`;

  console.log("📁 Transcribing:", audioPath);
  console.log("📟 Running:", command);

  exec(command, (error, stdout, stderr) => {
    console.log("📤 WHISPER STDOUT:", stdout);
    console.log("⚠️ WHISPER STDERR:", stderr);

    if (error) {
      console.error("❌ Whisper CLI error:", error);
      return res.status(500).json({
        message: "Whisper transcription failed.",
        error: error.message,
      });
    }

    console.log("📄 Looking for transcript at:", outputFile);

    fs.readFile(outputFile, "utf-8", (err, data) => {
      if (err) {
        console.error("📛 Read transcript error:", err);
        return res.status(500).json({
          message: "Could not read transcript.",
          error: err.message,
        });
      }

      res.status(200).json({ transcription: data });
    });
  });
};
