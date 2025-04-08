"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import {
  Typography,
  TextField,
  Button,
  Box,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";

const EditStoryPage = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [loading, setLoading] = useState(true);
  const [story, setStory] = useState<any>(null);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    location: "",
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (id) fetchStory();
  }, [id]);

  const fetchStory = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/stories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;
      setStory(data);
      setFormData({
        title: data.title,
        content: data.content,
        category: data.category,
        location: data.location,
      });
    } catch (err) {
      setError("Failed to fetch story.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/stories/${id}`,
        { ...formData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      router.push("/user");
    } catch (err) {
      setError("Failed to update story.");
    }
  };

  if (loading) {
    return <CircularProgress sx={{ display: "block", mt: 5, mx: "auto" }} />;
  }

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Edit Text Story
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        fullWidth
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Content"
        name="content"
        multiline
        rows={6}
        value={formData.content}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Category"
        name="category"
        value={formData.category}
        onChange={handleChange}
        select
        margin="normal"
      >
        <MenuItem value="Personal Growth">Personal Growth</MenuItem>
        <MenuItem value="Career">Career</MenuItem>
        <MenuItem value="Education">Education</MenuItem>
        <MenuItem value="AI">AI</MenuItem>
      </TextField>
      <TextField
        fullWidth
        label="Location"
        name="location"
        value={formData.location}
        onChange={handleChange}
        margin="normal"
      />

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={handleUpdate}
      >
        Update Story
      </Button>
    </Box>
  );
};

export default EditStoryPage;
