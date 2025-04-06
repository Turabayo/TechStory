require("dotenv").config();
const { SpeechClient } = require("@google-cloud/speech");

const client = new SpeechClient();

async function manualTranscribe() {
  const gcsUri = `gs://${process.env.GCS_BUCKET_NAME}/test.mp3`; // <- make sure it matches your uploaded file

  const request = {
    audio: { uri: gcsUri },
    config: {
      languageCode: "en-US",
    },
  };

  try {
    console.log("🎙️ Transcribing:", gcsUri);
    const [operation] = await client.longRunningRecognize(request);
    const [response] = await operation.promise();

    const transcription = response.results
      .map((result) => result.alternatives[0].transcript)
      .join("\n");

    console.log("✅ Transcription:\n", transcription || "No speech recognized.");
  } catch (error) {
    console.error("❌ Transcription error:", error.message);
  }
}

manualTranscribe();
