// frontend/src/app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Typography, Grid, Card, CardContent, CircularProgress, Box, AppBar, Toolbar, IconButton, InputBase,
  Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions, Button, Tabs, Tab, Stack, Chip, Select, MenuItem
} from "@mui/material";
import {
  Dashboard, Book, People, BarChart, Settings, ExitToApp, LibraryBooks, HourglassEmpty,
  PeopleAlt, Comment, Visibility, Share, Search, Notifications, AccountCircle, Logout as LogoutIcon,
  ThumbUp, Cancel, Delete, Download
} from "@mui/icons-material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler
} from "chart.js";
import useAuth from "../../hooks/useAuth";
import { utils, writeFile } from "xlsx";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);
interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  onboarded: boolean;
}

const API = process.env.NEXT_PUBLIC_API_URL;
const drawerWidth = 240;

const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth() as { user: AuthUser | null; loading: boolean };
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [subTab, setSubTab] = useState("all");
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState([]);
  const [stories, setStories] = useState([]);
  const [comments, setComments] = useState([]);
  const [analytics, setAnalytics] = useState({ storyTrends: [], totalViews: 0, totalShares: 0 });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!authLoading && user) {
      if (user.role !== "admin") {
        router.push("/user"); // redirect non-admins to user dashboard
      } else {
        fetchAllAdminData(); // only fetch if user is admin
      }
    }
  }, [authLoading, user]);  

  const fetchAllAdminData = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
  
      const [usersRes, storiesRes, commentsRes, analyticsRes] = await Promise.all([
        axios.get(`${API}/api/auth/users`, config),
        axios.get(`${API}/api/stories/admin/all`, config),
        axios.get(`${API}/api/comments`, config),
        axios.get(`${API}/api/analytics/stats`, config),
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
      await axios.patch(`${API}/api/stories/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchAllAdminData();
    } catch (err) {
      console.error("❌ Failed to update status", err);
    }
  };

  const deleteStory = async (id: string) => {
    try {
      await axios.delete(`${API}/api/stories/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchAllAdminData();
    } catch (err) {
      console.error("❌ Failed to delete story", err);
    }
  };

  const promoteDemoteUser = async (id: string, role: string) => {
    try {
      await axios.patch(`${API}/api/auth/users/${id}/role`, { role }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchAllAdminData();
    } catch (err) {
      console.error("❌ Failed to update role", err);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await axios.delete(`${API}/api/auth/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchAllAdminData();
    } catch (err) {
      console.error("❌ Failed to delete user", err);
    }
  };

  const deleteComment = async (id: string) => {
    try {
      await axios.delete(`${API}/api/comments/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchAllAdminData();
    } catch (err) {
      console.error("❌ Failed to delete comment", err);
    }
  };

  const exportStoriesToCSV = () => {
    const data = stories.map((s: any) => ({
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

  const filteredStories = stories.filter((story: any) =>
    `${story.title} ${story.content} ${story.user?.name || ""}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter((user: any) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredComments = comments.filter((c: any) =>
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

  const sidebarItems = [
    { text: "Dashboard", icon: <Dashboard />, tab: "Dashboard" },
    { text: "Stories", icon: <Book />, tab: "Stories" },
    { text: "Pending Approvals", icon: <HourglassEmpty />, tab: "Pending Approvals" },
    { text: "Users", icon: <People />, tab: "Users" },
    { text: "Comments", icon: <Comment />, tab: "Comments" },
    { text: "Metrics", icon: <BarChart />, tab: "Metrics" },
    { text: "Settings", icon: <Settings />, tab: "Settings" },
  ];

  const renderStoriesTab = () => {
    const displayedStories =
      subTab === "pending"
        ? filteredStories.filter((story: any) => story.status === "pending")
        : filteredStories;

    return (
      <>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Tabs value={subTab} onChange={(e, val) => setSubTab(val)} textColor="secondary" indicatorColor="secondary">
            <Tab label="All Stories" value="all" />
            <Tab label="Pending Approvals" value="pending" />
          </Tabs>
          <Button startIcon={<Download />} variant="outlined" onClick={exportStoriesToCSV}>Export CSV</Button>
        </Box>
        <Grid container spacing={2}>
          {displayedStories.map((story: any) => (
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
      {filteredUsers.map((u: any) => (
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
      {filteredComments.map((c: any) => (
        <Grid item xs={12} key={c._id}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1"><strong>Comment:</strong> {c.text}</Typography>
              <Typography variant="body2" color="text.secondary">
                By: {c.user?.name || "Unknown"} | On Story: {c.story?.title || "Unknown"}
              </Typography>
              <Button size="small" color="error" variant="outlined" sx={{ mt: 1 }} onClick={() => deleteComment(c._id)}>Delete</Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderMetricsTab = () => (
    <Box>
      <Typography variant="h6" gutterBottom>Story Trends</Typography>
      <Line data={chartData} />
    </Box>
  );

  const renderSettingsTab = () => (
    <Box>
      <Typography variant="h6" gutterBottom>Settings</Typography>
      <Typography variant="body2">You can add theme settings, export formats, or preferences here.</Typography>
    </Box>
  );

  if (authLoading || !user || loading) {
    return <CircularProgress sx={{ display: "block", margin: "auto", mt: 5 }} />;
  }  

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "#6A1B9A",
            color: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          },
        }}
      >
        <Box>
          <Toolbar />
          <List>
            {sidebarItems.map(({ text, icon, tab }) => (
              <ListItem
                key={text}
                onClick={() => setActiveTab(tab)}
                sx={{
                  cursor: "pointer",
                  bgcolor: activeTab === tab ? "#9C27B0" : "transparent",
                  color: activeTab === tab ? "white" : "#E1BEE7",
                  "&:hover": { bgcolor: "#9C27B0", color: "white" },
                }}
              >
                <ListItemIcon sx={{ color: activeTab === tab ? "white" : "#E1BEE7" }}>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Divider sx={{ bgcolor: "#E1BEE7", mx: 2 }} />
          <List>
            <ListItem onClick={() => setLogoutDialogOpen(true)} sx={{ cursor: "pointer", color: "#E1BEE7", "&:hover": { bgcolor: "#9C27B0", color: "white" } }}>
              <ListItemIcon sx={{ color: "#E1BEE7" }}><ExitToApp /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`, bgcolor: "#9C27B0" }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>HerTechStory Admin</Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <InputBase placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} sx={{ bgcolor: "white", borderRadius: 1, px: 1, mr: 2 }} />
              <IconButton sx={{ color: "white" }}><Search /></IconButton>
              <IconButton sx={{ color: "white" }}><Notifications /></IconButton>
              <IconButton sx={{ color: "white" }}><AccountCircle /></IconButton>
              <IconButton onClick={() => setLogoutDialogOpen(true)} sx={{ color: "white" }}><LogoutIcon /></IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        <Toolbar />

        <Typography variant="h4" fontWeight="bold" gutterBottom>{activeTab}</Typography>

        {["Stories", "Pending Approvals"].includes(activeTab) && renderStoriesTab()}
        {activeTab === "Dashboard" && (
          <Grid container spacing={3}>
            {[ 
              { label: "Total Users", value: users.length, icon: <PeopleAlt sx={{ fontSize: 40, color: "#6A1B9A" }} /> },
              { label: "Published Stories", value: stories.filter((s: any) => s.status === "published").length, icon: <LibraryBooks sx={{ fontSize: 40, color: "#6A1B9A" }} /> },
              { label: "Pending Approvals", value: stories.filter((s: any) => s.status === "pending").length, icon: <HourglassEmpty sx={{ fontSize: 40, color: "#6A1B9A" }} /> },
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
        )}
        {activeTab === "Users" && renderUsersTab()}
        {activeTab === "Comments" && renderCommentsTab()}
        {activeTab === "Metrics" && renderMetricsTab()}
        {activeTab === "Settings" && renderSettingsTab()}

        <Dialog open={logoutDialogOpen} onClose={() => setLogoutDialogOpen(false)}>
          <DialogTitle>Confirm Logout</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to log out?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setLogoutDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleLogout} color="error" variant="contained">Logout</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
