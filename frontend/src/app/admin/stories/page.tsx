"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography, Grid, Card, CardContent, CircularProgress, Box, Button, Chip, Stack,
  Tooltip, TextField, Select, MenuItem
} from "@mui/material";
import { Delete, Download } from "@mui/icons-material";
import { utils, writeFile } from "xlsx";

const AdminStories = () => {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [storyTypeFilter, setStoryTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const storiesPerPage = 6;

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/stories/admin/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStories(res.data);
    } catch (err) {
      console.error("Error fetching stories:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteStory = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/stories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchStories();
    } catch (err) {
      console.error("❌ Failed to delete story", err);
    }
  };

  const exportStoriesToCSV = () => {
    const data = filteredStories.map((s: any) => ({
      Title: s.title,
      Type: s.storyType,
      Category: s.category,
      Status: s.status,
      Views: s.views,
      Shares: s.shares,
    }));
    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Stories");
    writeFile(wb, "HerTechStories.csv");
  };

  const filteredStories = stories.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = storyTypeFilter === "all" || s.storyType === storyTypeFilter;
    const matchesCategory = categoryFilter === "all" || s.category === categoryFilter;
    return matchesSearch && matchesType && matchesCategory;
  });

  const paginatedStories = filteredStories.slice((page - 1) * storiesPerPage, page * storiesPerPage);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        All Stories
      </Typography>

      {/* Controls */}
      <Stack direction="row" spacing={2} mb={3} flexWrap="wrap">
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Select
          value={storyTypeFilter}
          onChange={(e) => setStoryTypeFilter(e.target.value)}
          size="small"
        >
          <MenuItem value="all">All Types</MenuItem>
          <MenuItem value="text">Text</MenuItem>
          <MenuItem value="voice">Voice</MenuItem>
          <MenuItem value="video">Video</MenuItem>
        </Select>
        <Select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          size="small"
        >
          <MenuItem value="all">All Categories</MenuItem>
          <MenuItem value="Inspiration">Inspiration</MenuItem>
          <MenuItem value="Education">Education</MenuItem>
          <MenuItem value="Career">Career</MenuItem>
        </Select>
        <Button variant="outlined" startIcon={<Download />} onClick={exportStoriesToCSV}>
          Export CSV
        </Button>
      </Stack>

      {/* Content */}
      {loading ? (
        <CircularProgress sx={{ display: "block", margin: "auto", mt: 5 }} />
      ) : paginatedStories.length === 0 ? (
        <Typography>No stories found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {paginatedStories.map((story) => (
            <Grid item xs={12} md={6} lg={4} key={story._id}>
              <Card
                sx={{
                  height: "100%",
                  transition: "0.3s",
                  "&:hover": { boxShadow: 6, border: "1px solid #9C27B0" },
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {story.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {story.content?.substring(0, 100)}...
                  </Typography>

                  <Stack direction="row" spacing={1} mt={1} mb={2}>
                    <Chip
                      label={story.storyType}
                      sx={{ bgcolor: "#E1BEE7", color: "#6A1B9A", borderRadius: 0, fontWeight: "bold" }}
                      size="small"
                    />
                    <Tooltip title={`Status: ${story.status.toUpperCase()}`} arrow>
                      <Chip
                        label={story.status}
                        sx={{
                          bgcolor:
                            story.status === "published"
                              ? "#C8E6C9"
                              : story.status === "pending"
                              ? "#FFF9C4"
                              : "#E0E0E0",
                          color: "#333",
                          borderRadius: 0,
                          fontWeight: "bold",
                        }}
                        size="small"
                      />
                    </Tooltip>
                  </Stack>

                  <Box display="flex" gap={1}>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<Delete />}
                      onClick={() => deleteStory(story._id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      <Box mt={4} display="flex" justifyContent="center" gap={2}>
        <Button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
          Prev
        </Button>
        <Typography>Page {page}</Typography>
        <Button
          onClick={() => setPage((p) => p + 1)}
          disabled={page * storiesPerPage >= filteredStories.length}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default AdminStories;
