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

const CreateTextStoryPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    location: "",
    coordinates: "",
    category: "",
    status: "published",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

      const payload = {
        title: formData.title,
        content: formData.content,
        storyType: "text",
        location: formData.location || "Unknown",
        coordinates: { coordinates: [lng, lat] },
        category: formData.category,
        status: formData.status,
      };

      const res = await axios.post("http://localhost:5000/api/stories", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Text story created:", res.data);
      router.push("/user");
    } catch (error: any) {
      console.error("❌ Error submitting text story:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Failed to submit story.");
    } finally {
      setLoading(false);
    }
  };

  const speakContent = () => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(formData.content);
    utterance.lang = "en-US";
    synth.speak(utterance);
  };

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 5 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Submit a Text Story
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Share your tech journey with the world in your own words.
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
          multiline
          rows={5}
          name="content"
          value={formData.content}
          onChange={handleChange}
          sx={{ mb: 1 }}
        />
        <Box sx={{ textAlign: "right", mb: 2 }}>
          <IconButton onClick={speakContent} color="primary">
            <VolumeUpIcon />
          </IconButton>
          <Typography variant="caption">Listen to this story</Typography>
        </Box>

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
          {loading ? <CircularProgress size={24} color="inherit" /> : "Submit Story"}
        </Button>
      </Paper>
    </Box>
  );
};

export default CreateTextStoryPage;
