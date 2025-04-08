// /frontend/src/app/user/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Typography,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItemText,
  ListItemIcon,
  Button,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Paper,
  Alert,
  Collapse,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  ListItemButton,
  MenuItem,
  Select,
  TextField,
  Pagination
} from "@mui/material";
import {
  Search,
  Notifications,
  AccountCircle,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  Folder as FolderIcon,
  Visibility as ViewsIcon,
  Share as SharesIcon,
  EditNote as EditNoteIcon,
  Description,
  Mic,
  VideoLibrary,
  VolumeUp,
  ExpandMore,
  ExpandLess,
  ContentCopy,
  Edit as EditIcon,
  Download as DownloadIcon
} from "@mui/icons-material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const drawerWidth = 240;

function UserDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [stories, setStories] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<string[]>([]);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [storyType, setStoryType] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const storiesPerPage = 6;
  const router = useRouter();
  
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  useEffect(() => {
    const checkUser = async () => {
      if (!token) return router.push("/auth/signin");
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.role === "admin") {
          alert("Admins are not allowed to access this page.");
          return router.push("/admin");
        }
      } catch {
        localStorage.removeItem("token");
        router.push("/auth/signin");
      }
    };
    checkUser();
  }, []);

  useEffect(() => {
    if (activeTab === "Dashboard") fetchDashboardStats();
    else fetchUserStories();
  }, [activeTab]);

  useEffect(() => {
    let data = [...stories];
    if (search.trim()) {
      data = data.filter(s => s.title.toLowerCase().includes(search.toLowerCase()));
    }
    if (storyType !== "all") {
      data = data.filter(s => s.storyType === storyType);
    }
    if (statusFilter !== "all") {
      data = data.filter(s => s.status === statusFilter);
    }
    setFiltered(data);
    setPage(1);
  }, [search, storyType, statusFilter, stories]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/stories/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStories(res.data);
    } catch {
      setError("Failed to load dashboard stats.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStories = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/stories/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStories(res.data);
    } catch {
      setError("Failed to load user stories.");
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const toggleExpand = (id: string) => {
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied transcription to clipboard.");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/auth/signin");
  };

  const handleEditStory = (id: string) => {
    router.push(`/user/stories/edit/${id}`);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const rows = filtered.map(story => [story.title, story.storyType, story.status, story.views, story.shares]);
    autoTable(doc, {
      head: [["Title", "Type", "Status", "Views", "Shares"]],
      body: rows,
    });
    doc.save("stories.pdf");
  };

  const exportCSV = () => {
    const ws = XLSX.utils.json_to_sheet(filtered.map(story => ({
      Title: story.title,
      Type: story.storyType,
      Status: story.status,
      Views: story.views,
      Shares: story.shares,
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Stories");
    XLSX.writeFile(wb, "stories.xlsx");
  };
  const paginatedStories = filtered.slice((page - 1) * storiesPerPage, page * storiesPerPage);
  const totalPages = Math.ceil(filtered.length / storiesPerPage);
  const [hasMounted, setHasMounted] = useState(false);

useEffect(() => {
  setHasMounted(true);
}, []);

if (!hasMounted) return null;
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
            {[{ text: "Dashboard", icon: <DashboardIcon />, action: () => setActiveTab("Dashboard") },
              { text: "My Stories", icon: <EditNoteIcon />, action: () => setActiveTab("My Stories") }            ].map(({ text, icon, action }) => (
              <ListItemButton
                key={text}
                onClick={action}
                sx={{
                  cursor: "pointer",
                  bgcolor: activeTab === text ? "#9C27B0" : "transparent",
                  color: activeTab === text ? "white" : "#E1BEE7",
                  "&:hover": { bgcolor: "#9C27B0", color: "white" },
                }}
              >
                <ListItemIcon sx={{ color: activeTab === text ? "white" : "#E1BEE7" }}>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            ))}
          </List>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Divider sx={{ bgcolor: "#E1BEE7", mx: 2 }} />
          <List>
            <ListItemButton
              onClick={() => setLogoutDialogOpen(true)}
              sx={{ color: "#E1BEE7", "&:hover": { bgcolor: "#9C27B0", color: "white" } }}
            >
              <ListItemIcon sx={{ color: "#E1BEE7" }}><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <AppBar position="fixed" sx={{ bgcolor: "#9C27B0", width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>{activeTab}</Typography>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search stories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ bgcolor: "white", borderRadius: 1, mr: 2 }}
            />
            <IconButton sx={{ color: "white" }}><Search /></IconButton>
            <IconButton sx={{ color: "white" }}><Notifications /></IconButton>
            <IconButton sx={{ color: "white" }}><AccountCircle /></IconButton>
            <IconButton sx={{ color: "white" }} onClick={() => setLogoutDialogOpen(true)}><LogoutIcon /></IconButton>
          </Toolbar>
        </AppBar>
        <Toolbar />

        {activeTab === "Dashboard" && (
          <>
            <Typography variant="h4" fontWeight="bold" gutterBottom>Overview</Typography>
            <Grid container spacing={3}>
              {[{ label: "Total Stories", value: stories.length, icon: <FolderIcon /> },
                { label: "Total Views", value: stories.reduce((a, s) => a + s.views, 0), icon: <ViewsIcon /> },
                { label: "Total Shares", value: stories.reduce((a, s) => a + s.shares, 0), icon: <SharesIcon /> }].map((item, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card sx={{ textAlign: "center", p: 2 }}>
                    <CardContent>
                      <ListItemIcon sx={{ color: "#9C27B0", fontSize: 40 }}>{item.icon}</ListItemIcon>
                      <Typography variant="h6">{item.label}</Typography>
                      <Typography variant="h4" fontWeight="bold">{item.value}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
              <Button variant="contained" sx={{ bgcolor: "#9C27B0" }} startIcon={<Description />} onClick={() => router.push("/user/stories/create")}>Submit Text Story</Button>
              <Button variant="contained" sx={{ bgcolor: "#9C27B0" }} startIcon={<Mic />} onClick={() => router.push("/user/stories/voice")}>Record Voice Story</Button>
              <Button variant="contained" sx={{ bgcolor: "#9C27B0" }} startIcon={<VideoLibrary />} onClick={() => router.push("/user/stories/video")}>Upload Video Story</Button>
            </Box>
          </>
        )}

        {activeTab === "My Stories" && (
          <>
            <Typography variant="h4" fontWeight="bold" gutterBottom>My Stories</Typography>
            <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
              <Select value={storyType} onChange={(e) => setStoryType(e.target.value)} size="small">
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="text">Text</MenuItem>
                <MenuItem value="voice">Voice</MenuItem>
                <MenuItem value="video">Video</MenuItem>
              </Select>
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} size="small">
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="published">Published</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
              <Button variant="outlined" onClick={exportPDF}>Export PDF</Button>
              <Button variant="outlined" onClick={exportCSV}>Export CSV</Button>
            </Box>

            {loading ? (
              <CircularProgress sx={{ display: "block", margin: "auto", mt: 5 }} />
            ) : (
              <>
                {paginatedStories.map((story) => (
                  <Paper key={story._id} sx={{ p: 2, my: 2 }}>
                    <Typography variant="h6" fontWeight="bold">{story.title}</Typography>
                    <Typography variant="caption" color="text.secondary">{story.storyType.toUpperCase()} • {story.status}</Typography>

                    {story.storyType === "text" && (
                      <>
                        <Typography sx={{ mt: 1 }}>{story.content}</Typography>
                        <IconButton onClick={() => speakText(story.content)}><VolumeUp /></IconButton>
                      </>
                    )}

                    {story.storyType === "voice" && (
                      <>
                        {story.audioUrl && <audio controls src={`http://localhost:5000${story.audioUrl}`} style={{ marginTop: 8 }} />}
                        {story.transcription && (
                          <>
                            <Collapse in={expanded.includes(story._id)}>
                              <Typography sx={{ mt: 1 }}>{story.transcription}</Typography>
                            </Collapse>
                            <Button onClick={() => toggleExpand(story._id)} endIcon={expanded.includes(story._id) ? <ExpandLess /> : <ExpandMore />}>
                              {expanded.includes(story._id) ? "Collapse" : "Read Transcription"}
                            </Button>
                            <IconButton onClick={() => handleCopy(story.transcription)}><ContentCopy /></IconButton>
                          </>
                        )}
                      </>
                    )}

                    {story.storyType === "video" && (
                      <>
                        {story.videoUrl && <video controls src={`http://localhost:5000${story.videoUrl}`} style={{ width: "100%", marginTop: 8 }} />}
                        {story.transcription && (
                          <>
                            <Collapse in={expanded.includes(story._id)}>
                              <Typography sx={{ mt: 1 }}>{story.transcription}</Typography>
                            </Collapse>
                            <Button onClick={() => toggleExpand(story._id)} endIcon={expanded.includes(story._id) ? <ExpandLess /> : <ExpandMore />}>
                              {expanded.includes(story._id) ? "Collapse" : "Read Transcription"}
                            </Button>
                            <IconButton onClick={() => handleCopy(story.transcription)}><ContentCopy /></IconButton>
                          </>
                        )}
                      </>
                    )}

                    <Box sx={{ mt: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={() => handleEditStory(story._id)}
                        startIcon={<EditNoteIcon/>}
                      >
                        Edit
                      </Button>
                    </Box>
                  </Paper>
                ))}

                {totalPages > 1 && (
                  <Box sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 2 }}>
                    <Button disabled={page === 1} onClick={() => setPage(p => p - 1)} sx={{ color: "#9C27B0" }}>Previous</Button>
                    <Typography>Page {page} of {totalPages}</Typography>
                    <Button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} sx={{ color: "#9C27B0" }}>Next</Button>
                  </Box>
                )}
              </>
            )}
          </>
        )}

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

export default UserDashboard;
