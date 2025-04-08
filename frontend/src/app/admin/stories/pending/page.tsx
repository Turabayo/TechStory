"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography, Grid, Card, CardContent, CircularProgress, Box, Button,
  Chip, Stack, Tooltip, TextField, Select, MenuItem
} from "@mui/material";
import {
  ThumbUp as ApproveIcon,
  Cancel as RejectIcon,
} from "@mui/icons-material";

const AdminPendingStories = () => {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [storyTypeFilter, setStoryTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const storiesPerPage = 6;

  useEffect(() => {
    fetchPendingStories();
  }, []);

  const fetchPendingStories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/stories/admin/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStories(res.data);
    } catch (err) {
      console.error("Error fetching stories:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStoryStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/stories/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPendingStories();
    } catch (err) {
      console.error("Failed to update story status:", err);
    }
  };

  const filteredStories = stories.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = storyTypeFilter === "all" || s.storyType === storyTypeFilter;
    const matchesCategory = categoryFilter === "all" || s.category === categoryFilter;
    return matchesSearch && matchesType && matchesCategory;
  });

  const paginatedStories = filteredStories.slice(
    (page - 1) * storiesPerPage,
    page * storiesPerPage
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Pending Stories
      </Typography>

      {/* Filters */}
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
      </Stack>

      {/* Results */}
      {loading ? (
        <CircularProgress sx={{ display: "block", margin: "auto", mt: 5 }} />
      ) : paginatedStories.length === 0 ? (
        <Typography>No pending stories found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {paginatedStories.map((story) => (
            <Grid item xs={12} md={6} lg={4} key={story._id}>
              <Card
                sx={{
                  transition: "0.3s",
                  "&:hover": { boxShadow: 6, border: "1px solid #9C27B0" },
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {story.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {story.content?.substring(0, 100)}...
                  </Typography>

                  <Stack direction="row" spacing={1} mt={1} mb={2}>
                    <Chip
                      label={story.storyType}
                      sx={{ bgcolor: "#E1BEE7", color: "#6A1B9A", borderRadius: 0, fontWeight: "bold" }}
                      size="small"
                    />
                    <Tooltip title="Pending approval" arrow>
                      <Chip
                        label="pending"
                        sx={{ bgcolor: "#FFF9C4", color: "#6A1B9A", borderRadius: 0, fontWeight: "bold" }}
                        size="small"
                      />
                    </Tooltip>
                  </Stack>

                  <Box display="flex" gap={1} flexWrap="wrap">
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      startIcon={<ApproveIcon />}
                      onClick={() => updateStoryStatus(story._id, "published")}
                    >
                      Approve
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<RejectIcon />}
                      onClick={() => updateStoryStatus(story._id, "rejected")}
                    >
                      Reject
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

export default AdminPendingStories;
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography, Grid, Card, CardContent, CircularProgress, Box, Button,
  Chip, Stack, Tooltip, TextField, Select, MenuItem
} from "@mui/material";
import {
  ThumbUp as ApproveIcon,
  Cancel as RejectIcon,
} from "@mui/icons-material";

const AdminPendingStories = () => {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [storyTypeFilter, setStoryTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const storiesPerPage = 6;

  useEffect(() => {
    fetchPendingStories();
  }, []);

  const fetchPendingStories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/stories/admin/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStories(res.data);
    } catch (err) {
      console.error("Error fetching stories:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStoryStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/stories/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPendingStories();
    } catch (err) {
      console.error("Failed to update story status:", err);
    }
  };

  const filteredStories = stories.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = storyTypeFilter === "all" || s.storyType === storyTypeFilter;
    const matchesCategory = categoryFilter === "all" || s.category === categoryFilter;
    return matchesSearch && matchesType && matchesCategory;
  });

  const paginatedStories = filteredStories.slice(
    (page - 1) * storiesPerPage,
    page * storiesPerPage
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Pending Stories
      </Typography>

      {/* Filters */}
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
      </Stack>

      {/* Results */}
      {loading ? (
        <CircularProgress sx={{ display: "block", margin: "auto", mt: 5 }} />
      ) : paginatedStories.length === 0 ? (
        <Typography>No pending stories found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {paginatedStories.map((story) => (
            <Grid item xs={12} md={6} lg={4} key={story._id}>
              <Card
                sx={{
                  transition: "0.3s",
                  "&:hover": { boxShadow: 6, border: "1px solid #9C27B0" },
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {story.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {story.content?.substring(0, 100)}...
                  </Typography>

                  <Stack direction="row" spacing={1} mt={1} mb={2}>
                    <Chip
                      label={story.storyType}
                      sx={{ bgcolor: "#E1BEE7", color: "#6A1B9A", borderRadius: 0, fontWeight: "bold" }}
                      size="small"
                    />
                    <Tooltip title="Pending approval" arrow>
                      <Chip
                        label="pending"
                        sx={{ bgcolor: "#FFF9C4", color: "#6A1B9A", borderRadius: 0, fontWeight: "bold" }}
                        size="small"
                      />
                    </Tooltip>
                  </Stack>

                  <Box display="flex" gap={1} flexWrap="wrap">
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      startIcon={<ApproveIcon />}
                      onClick={() => updateStoryStatus(story._id, "published")}
                    >
                      Approve
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<RejectIcon />}
                      onClick={() => updateStoryStatus(story._id, "rejected")}
                    >
                      Reject
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

