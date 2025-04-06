const path = require("path");
const { Storage } = require("@google-cloud/storage");
const speech = require("@google-cloud/speech");

const client = new speech.SpeechClient();
const storage = new Storage();

// ✅ Replace with your actual bucket name
const BUCKET_NAME = "your-bucket-name";

exports.transcribeAudio = async (relativePath) => {
  const localPath = path.join(__dirname, "..", relativePath); // e.g. uploads/audio/xyz.mp3
  const filename = path.basename(relativePath);
  const destination = `audio/${filename}`;

  // ✅ Upload to GCS
  await storage.bucket(BUCKET_NAME).upload(localPath, {
    destination,
    resumable: false,
  });

  const gcsUri = `gs://${BUCKET_NAME}/${destination}`;

  const audio = {
    uri: gcsUri,
  };

  const config = {
    encoding: "MP3",
    sampleRateHertz: 16000,
    languageCode: "en-US",
  };

  const request = {
    audio,
    config,
  };

  const [operation] = await client.longRunningRecognize(request);
  const [response] = await operation.promise();

  const transcription = response.results
    .map((result) => result.alternatives[0].transcript)
    .join("\n");

  return transcription;
};
