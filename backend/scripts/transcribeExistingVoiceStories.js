// hertechstory-backend/scripts/transcribeExistingVoiceStories.js
require("dotenv").config();
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const Story = require("../models/Story");
const { Storage } = require("@google-cloud/storage");
const { transcribeAudio } = require("../config/googleSpeechToText");

const MONGO_URI = process.env.MONGO_URI;
const BUCKET_NAME = process.env.GCS_BUCKET_NAME;

mongoose.connect(MONGO_URI, {});

const storage = new Storage();

const uploadToGCS = async (filePath, destination) => {
  try {
    await storage.bucket(BUCKET_NAME).upload(filePath, {
      destination,
      gzip: true,
      metadata: {
        cacheControl: "no-cache",
      },
    });
    return `gs://${BUCKET_NAME}/${destination}`;
  } catch (err) {
    console.error("❌ Failed to upload to GCS:", err.message);
    throw err;
  }
};

const transcribeAllVoiceStories = async () => {
  try {
    const stories = await Story.find({
      storyType: "voice",
      transcription: { $in: [null, "", undefined] },
    });

    console.log(`🔍 Found ${stories.length} voice stories needing transcription...`);

    for (const story of stories) {
      try {
        // Step 1: Resolve local file path
        const localPath = path.join(__dirname, "..", story.audioUrl);

        // Step 2: Upload to GCS
        const fileName = path.basename(story.audioUrl);
        const gcsUri = await uploadToGCS(localPath, `audio/${fileName}`);

        // Step 3: Transcribe via GCS URI
        const transcription = await transcribeAudio(gcsUri);

        // Step 4: Save transcription to DB
        story.transcription = transcription;
        await story.save();

        console.log(`✅ Transcribed "${story.title}"`);
      } catch (err) {
        console.error(`❌ Error transcribing "${story.title}": ${err.message}`);
      }
    }

    console.log("🎉 All done.");
    process.exit(0);
  } catch (err) {
    console.error("🔥 Fatal error:", err.message);
    process.exit(1);
  }
};

transcribeAllVoiceStories();
