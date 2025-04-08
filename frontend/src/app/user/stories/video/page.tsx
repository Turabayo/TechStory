"use client";

import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  IconButton,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";

const VideoStoryPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    location: "",
    coordinates: "",
    category: "",
    videoFile: null as File | null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ttsLoading, setTtsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const speakText = (text: string) => {
    if (!window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    speechSynthesis.speak(utterance);
  };

  const handleUpload = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication required.");

      if (!formData.videoFile) throw new Error("No video file selected.");

      const uploadData = new FormData();
      uploadData.append("video", formData.videoFile);

      const uploadRes = await axios.post(
        "http://localhost:5000/api/stories/upload/video",
        uploadData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return uploadRes.data.videoUrl;
    } catch (err) {
      console.error("❌ Video upload failed:", err);
      throw err;
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required.");
        return;
      }

      const [lng, lat] = formData.coordinates.split(",").map(Number);
      if (isNaN(lng) || isNaN(lat)) {
        setError("Invalid coordinates. Use format: longitude,latitude");
        return;
      }

      // ✅ Step 1: Upload video
      const uploadedVideoUrl = await handleUpload();

      // ✅ Step 2: Submit story (transcription handled in backend)
      const res = await axios.post(
        "http://localhost:5000/api/stories/video",
        {
          title: formData.title,
          content: formData.content,
          storyType: "video",
          videoUrl: uploadedVideoUrl,
          location: formData.location,
          coordinates: { coordinates: [lng, lat] },
          category: formData.category,
          status: "published",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Video story submitted:", res.data);
      router.push("/user");
    } catch (error: any) {
      console.error("❌ Error submitting video story:", error);
      setError("Failed to submit video story.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 5 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Upload Your Tech Video Story
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Inspire others with a video about your journey in tech.
      </Typography>

      <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
        <TextField
          fullWidth
          label="Story Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          multiline
          rows={4}
          sx={{ mb: 2 }}
        />

        <Button component="label" variant="outlined" fullWidth sx={{ mb: 2 }}>
          Upload Video File
          <input
            type="file"
            name="videoFile"
            accept="video/*"
            hidden
            onChange={handleChange}
          />
        </Button>

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
          placeholder="e.g. 36.8219,-1.2921"
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="e.g. AI, Web Dev, Cybersecurity"
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
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Submit Video Story"
          )}
        </Button>
      </Paper>
    </Box>
  );
};

export default VideoStoryPage;
