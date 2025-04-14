"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosResponse } from "axios";
import {
  Typography, Grid, Card, CardContent, CircularProgress, Box, AppBar, Toolbar,
  IconButton, InputBase, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button,
  Tabs, Tab, Stack, Chip, Select, MenuItem
} from "@mui/material";
import {
  Dashboard, Book, People, BarChart, Settings, ExitToApp, LibraryBooks, HourglassEmpty,
  PeopleAlt, Comment, Visibility, Share, Search, Notifications, AccountCircle,
  Logout as LogoutIcon, ThumbUp, Cancel, Delete, Download
} from "@mui/icons-material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler
} from "chart.js";
import useAuth from "../../hooks/useAuth";
import { utils, writeFile } from "xlsx";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const drawerWidth = 240;

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Story {
  _id: string;
  title: string;
  content: string;
  storyType: string;
  category: string;
  status: string;
  views: number;
  shares: number;
  user?: User;
}

interface CommentType {
  _id: string;
  text: string;
  user?: User;
  story?: {
    title: string;
  };
}

interface Analytics {
  storyTrends: number[];
  totalViews: number;
  totalShares: number;
}
const AdminDashboard = () => {
  const { loading: authLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [subTab, setSubTab] = useState("all");
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState<User[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({ storyTrends: [], totalViews: 0, totalShares: 0 });
  const [searchQuery, setSearchQuery] = useState("");

  const sidebarItems = [
    { text: "Dashboard", icon: <Dashboard />, tab: "Dashboard" },
    { text: "Stories", icon: <Book />, tab: "Stories" },
    { text: "Pending Approvals", icon: <HourglassEmpty />, tab: "Pending Approvals" },
    { text: "Users", icon: <People />, tab: "Users" },
    { text: "Comments", icon: <Comment />, tab: "Comments" },
    { text: "Metrics", icon: <BarChart />, tab: "Metrics" },
    { text: "Settings", icon: <Settings />, tab: "Settings" },
  ];

  useEffect(() => {
    fetchAllAdminData();
  }, []);

  const fetchAllAdminData = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [usersRes, storiesRes, commentsRes, analyticsRes]: AxiosResponse[] = await Promise.all([
        axios.get("http://localhost:5000/api/auth/users", config),
        axios.get("http://localhost:5000/api/stories/admin/all", config),
        axios.get("http://localhost:5000/api/comments", config),
        axios.get("http://localhost:5000/api/analytics/stats", config),
      ]);

      setUsers(usersRes.data);
      setStories(storiesRes.data);
      setComments(commentsRes.data);
      setAnalytics(analyticsRes.data);
    } catch (err) {
      console.error("❌ Admin fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/signin");
  };

  const updateStoryStatus = async (id: string, status: string) => {
    try {
      await axios.patch(`http://localhost:5000/api/stories/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchAllAdminData();
    } catch (err) {
      console.error("❌ Failed to update status", err);
    }
  };

  const deleteStory = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/stories/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchAllAdminData();
    } catch (err) {
      console.error("❌ Failed to delete story", err);
    }
  };

  const promoteDemoteUser = async (id: string, role: string) => {
    try {
      await axios.patch(`http://localhost:5000/api/auth/users/${id}/role`, { role }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchAllAdminData();
    } catch (err) {
      console.error("❌ Failed to update role", err);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/auth/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchAllAdminData();
    } catch (err) {
      console.error("❌ Failed to delete user", err);
    }
  };

  const deleteComment = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/comments/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchAllAdminData();
    } catch (err) {
      console.error("❌ Failed to delete comment", err);
    }
  };

  const exportStoriesToCSV = () => {
    const data = stories.map((s) => ({
      Title: s.title,
      Author: s.user?.name || "Unknown",
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

  const filteredStories = stories.filter((story) =>
    `${story.title} ${story.content} ${story.user?.name || ""}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredComments = comments.filter((c) =>
    c.text?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Stories Submitted",
        data: analytics.storyTrends,
        borderColor: "#6A1B9A",
        backgroundColor: "rgba(106, 27, 154, 0.2)",
        fill: true,
      },
    ],
  };

  if (authLoading || loading) {
    return <CircularProgress sx={{ display: "block", margin: "auto", mt: 5 }} />;
  }
  const renderDashboardCards = () => (
    <Grid container spacing={3}>
      {[
        { label: "Total Users", value: users.length, icon: <PeopleAlt sx={{ fontSize: 40, color: "#6A1B9A" }} /> },
        { label: "Published Stories", value: stories.filter(s => s.status === "published").length, icon: <LibraryBooks sx={{ fontSize: 40, color: "#6A1B9A" }} /> },
        { label: "Pending Approvals", value: stories.filter(s => s.status === "pending").length, icon: <HourglassEmpty sx={{ fontSize: 40, color: "#6A1B9A" }} /> },
        { label: "Total Comments", value: comments.length, icon: <Comment sx={{ fontSize: 40, color: "#6A1B9A" }} /> },
        { label: "Total Views", value: analytics.totalViews, icon: <Visibility sx={{ fontSize: 40, color: "#6A1B9A" }} /> },
        { label: "Total Shares", value: analytics.totalShares, icon: <Share sx={{ fontSize: 40, color: "#6A1B9A" }} /> },
      ].map(({ label, value, icon }, index) => (
        <Grid item xs={12} md={4} key={index}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {icon}
                <Typography variant="h6">{label}</Typography>
              </Box>
              <Typography variant="h4">{value}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
  
  const renderStoriesTab = () => {
    const displayedStories = subTab === "pending"
      ? filteredStories.filter(story => story.status === "pending")
      : filteredStories;
  
    return (
      <>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Tabs value={subTab} onChange={(_, val) => setSubTab(val)} textColor="secondary" indicatorColor="secondary">
            <Tab label="All Stories" value="all" />
            <Tab label="Pending Approvals" value="pending" />
          </Tabs>
          <Button startIcon={<Download />} variant="outlined" onClick={exportStoriesToCSV}>
            Export CSV
          </Button>
        </Box>
        <Grid container spacing={2}>
          {displayedStories.map(story => (
            <Grid item xs={12} md={6} lg={4} key={story._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">{story.title}</Typography>
                  <Typography variant="body2" gutterBottom>{story.content?.substring(0, 100)}...</Typography>
                  <Stack direction="row" spacing={1} mt={1} mb={2}>
                    <Chip label={story.storyType} color="primary" size="small" />
                    <Chip label={story.status} color={
                      story.status === "published" ? "success"
                      : story.status === "pending" ? "warning" : "default"
                    } size="small" />
                  </Stack>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {story.status === "pending" && (
                      <>
                        <Button size="small" variant="contained" color="success" startIcon={<ThumbUp />} onClick={() => updateStoryStatus(story._id, "published")}>Approve</Button>
                        <Button size="small" variant="outlined" color="warning" startIcon={<Cancel />} onClick={() => updateStoryStatus(story._id, "rejected")}>Reject</Button>
                      </>
                    )}
                    <Button size="small" variant="text" color="error" startIcon={<Delete />} onClick={() => deleteStory(story._id)}>Delete</Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </>
    );
  };
  
  const renderUsersTab = () => (
    <Grid container spacing={2}>
      {filteredUsers.map((u) => (
        <Grid item xs={12} md={6} lg={4} key={u._id}>
          <Card>
            <CardContent>
              <Typography variant="h6">{u.name}</Typography>
              <Typography variant="body2">{u.email}</Typography>
              <Chip label={u.role} color={u.role === "admin" ? "success" : "default"} sx={{ my: 1 }} />
              <Box mt={2} sx={{ display: "flex", gap: 1 }}>
                <Select value={u.role} onChange={(e) => promoteDemoteUser(u._id, e.target.value)} size="small">
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
                <Button size="small" color="error" variant="outlined" onClick={() => deleteUser(u._id)}>Delete</Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
  const renderCommentsTab = () => (
    <Grid container spacing={2}>
      {filteredComments.map((c) => (
        <Grid item xs={12} key={c._id}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1">
                <strong>Comment:</strong> {c.text}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                By: {c.user?.name || "Unknown"} | On Story: {c.story?.title || "Unknown"}
              </Typography>
              <Button
                size="small"
                color="error"
                variant="outlined"
                sx={{ mt: 1 }}
                onClick={() => deleteComment(c._id)}
              >
                Delete
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
  
  const renderMetricsTab = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Story Trends
      </Typography>
      <Line data={chartData} />
    </Box>
  );
  
  const renderSettingsTab = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Settings
      </Typography>
      <Typography variant="body2">
        You can add theme settings, export formats, or preferences here.
      </Typography>
    </Box>
  );

  