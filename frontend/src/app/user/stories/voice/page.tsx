"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  TextField,
  CircularProgress,
  IconButton,
  InputLabel,
} from "@mui/material";
import {
  ContentCopy as CopyIcon,
  VolumeUp as ListenIcon,
} from "@mui/icons-material";
import axios from "axios";
import { useRouter } from "next/navigation";

const VoiceStoryPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    coordinates: "",
    category: "",
    transcription: "",
    audioFile: null as File | null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, audioFile: e.target.files[0] });
    }
  };

  const speakText = (text: string) => {
    if (typeof window !== "undefined") {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication required.");

      const [lng, lat] = formData.coordinates.split(",").map(Number);
      if (isNaN(lng) || isNaN(lat)) {
        throw new Error("Invalid coordinates. Use format: longitude,latitude");
      }

      const audioData = new FormData();
      audioData.append("audio", formData.audioFile as File);

      const uploadRes = await axios.post(
        "http://localhost:5000/api/stories/upload/audio",
        audioData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const audioUrl = uploadRes.data.audioUrl;

      const res = await axios.post(
        "http://localhost:5000/api/stories/voice",
        {
          title: formData.title,
          storyType: "voice",
          audioUrl,
          transcription: formData.transcription,
          location: formData.location,
          coordinates: { coordinates: [lng, lat] },
          category: formData.category,
          status: "published",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("✅ Voice story submitted:", res.data);
      router.push("/user");
    } catch (err: any) {
      console.error("❌ Error submitting voice story:", err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 5 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Submit Voice Story
      </Typography>
      <Typography variant="subtitle1">
        Upload a voice recording and optionally add your own transcription.
      </Typography>

      <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
        <TextField
          fullWidth
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <InputLabel sx={{ mb: 1 }}>Upload Audio File</InputLabel>
        <input
          type="file"
          accept="audio/*"
          onChange={handleAudioChange}
          style={{ marginBottom: "16px" }}
        />

        <TextField
          multiline
          fullWidth
          minRows={4}
          label="Transcription (optional)"
          name="transcription"
          value={formData.transcription}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        {formData.transcription && (
          <Box display="flex" justifyContent="flex-end" sx={{ mb: 2 }}>
            <IconButton onClick={() => speakText(formData.transcription)}>
              <ListenIcon />
            </IconButton>
            <IconButton onClick={() => navigator.clipboard.writeText(formData.transcription)}>
              <CopyIcon />
            </IconButton>
          </Box>
        )}

        <TextField
          fullWidth
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Coordinates (lng, lat)"
          name="coordinates"
          value={formData.coordinates}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Button
          variant="contained"
          fullWidth
          sx={{ bgcolor: "#9C27B0", color: "white" }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Submit Story"}
        </Button>
      </Paper>
    </Box>
  );
};

export default VoiceStoryPage;