"use client";

import { useEffect, useState } from "react";
import {
  Container, Typography, Grid, Card, CardContent, CircularProgress,
  Button, Collapse, IconButton, Tooltip, Fade, TextField, Box
} from "@mui/material";
import {
  ContentCopy, ExpandMore, ExpandLess, VolumeUp,
  Visibility, Share as ShareIcon
} from "@mui/icons-material";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface Story {
  _id: string;
  title: string;
  content?: string;
  transcription?: string;
  storyType?: "text" | "voice" | "video";
  audioUrl?: string;
  videoUrl?: string;
  views?: number;
  shares?: number;
}

interface Comment {
  _id: string;
  user: string;
  story: string;
  text: string;
  createdAt: string;
}

const Stories = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [expandedTranscripts, setExpandedTranscripts] = useState<string[]>([]);
  const [recentShareId, setRecentShareId] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [page, setPage] = useState(1);
  const storiesPerPage = 6;

  useEffect(() => setHasMounted(true), []);

  useEffect(() => {
    axios.get("http://localhost:5000/api/stories")
      .then((res) => {
        setStories(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching stories:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    stories.forEach((story) => {
      axios.get(`http://localhost:5000/api/comments/${story._id}`)
        .then((res) => {
          setComments(prev => ({ ...prev, [story._id]: res.data }));
        })
        .catch(err => console.error("Error fetching comments:", err));
    });
  }, [stories]);

  const toggleTranscript = (id: string) => {
    setExpandedTranscripts(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("📋 Transcription copied to clipboard!");
  };

  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  const handleShare = async (story: Story, platform: string) => {
    const shareUrl = `${window.location.origin}/stories`;
    const userId = localStorage.getItem("userId");
    let shareLink = "";

    switch (platform) {
      case "Twitter":
        shareLink = `https://x.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(story.title)}`;
        break;
      case "Facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case "WhatsApp":
        shareLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(story.title + " - " + shareUrl)}`;
        break;
      default:
        toast.error("Unsupported platform");
        return;
    }

    try {
      const newWindow = window.open(shareLink, "_blank", "noopener,noreferrer");
      if (newWindow) {
        await axios.post(`http://localhost:5000/api/stories/${story._id}/increment-share`, {
          sharedBy: userId || "anonymous",
          platform,
        });

        setStories(prev =>
          prev.map(s => s._id === story._id ? { ...s, shares: (s.shares || 0) + 1 } : s)
        );
        setRecentShareId(story._id);
        toast.success(`🎉 Shared on ${platform}`);
      } else {
        toast.error("Popup blocked. Please allow popups to share.");
      }
    } catch (err) {
      console.error("Share error:", err);
      toast.error("Failed to share story");
    }
  };

  const handleCommentSubmit = async (storyId: string) => {
    const token = localStorage.getItem("token");
    const text = newComment[storyId];

    console.log("🛠 Submitting comment with:", { storyId, token, text });

    if (!token || !text) {
      toast.error("🚫 You must be logged in to comment.");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:5000/api/comments/${storyId}`,
        { text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComments(prev => ({
        ...prev,
        [storyId]: [res.data, ...(prev[storyId] || [])],
      }));

      setNewComment(prev => ({ ...prev, [storyId]: "" }));
      toast.success("💬 Comment added!");
    } catch (err: any) {
      console.error("❌ Comment submission failed:", err.response?.data || err.message);
      toast.error("Failed to post comment");
    }
  };

  const paginatedStories = stories.slice(
    (page - 1) * storiesPerPage,
    page * storiesPerPage
  );

  if (!hasMounted) return null;

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Typography variant="h3" fontWeight="bold" textAlign="center" gutterBottom>
          Tech Stories
        </Typography>

        {loading ? (
          <CircularProgress sx={{ display: "block", margin: "auto" }} />
        ) : (
          <>
            <Grid container spacing={4}>
              {paginatedStories.map((story) => (
                <Grid item xs={12} md={6} lg={4} key={story._id}>
                  <Fade in timeout={600}>
                    <Card
                      sx={{
                        border: story._id === recentShareId ? "2px solid #9C27B0" : undefined,
                        boxShadow: story._id === recentShareId ? 6 : 1,
                        transition: "all 0.3s",
                      }}
                    >
                      <CardContent>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                          {story.title}
                        </Typography>

                        <Typography variant="caption" color="text.secondary" gutterBottom>
                          {story.storyType?.toUpperCase()}
                        </Typography>

                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          <Visibility fontSize="small" sx={{ mr: 0.5 }} />
                          {story.views || 0} views • <ShareIcon fontSize="small" sx={{ mr: 0.5 }} />
                          {story.shares || 0} shares
                        </Typography>

                        {story.storyType === "text" && story.content && (
                          <>
                            <Typography variant="body2">
                              {story.content.substring(0, 200)}...
                            </Typography>
                            <Tooltip title="Listen to this story" arrow>
                              <IconButton onClick={() => speakText(story.content!)}>
                                <VolumeUp />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}

                        {story.storyType === "voice" && story.audioUrl && (
                          <>
                            <Typography variant="body2" sx={{ mb: 1 }}>🗣️ Voice Story</Typography>
                            <audio controls style={{ width: "100%", marginBottom: 8 }}>
                              <source src={`http://localhost:5000${story.audioUrl}`} type="audio/mp3" />
                            </audio>
                          </>
                        )}

                        {story.storyType === "video" && story.videoUrl && (
                          <>
                            <Typography variant="body2" sx={{ fontStyle: "italic", mb: 1 }}>
                              🎥 This is a video story.
                            </Typography>
                            <video controls style={{ width: "100%", maxHeight: 300 }}>
                              <source src={`http://localhost:5000${story.videoUrl}`} type="video/mp4" />
                            </video>
                          </>
                        )}

                        {story.transcription && (
                          <>
                            <Collapse in={expandedTranscripts.includes(story._id)}>
                              <Typography variant="body2">{story.transcription}</Typography>
                            </Collapse>
                            <Button
                              size="small"
                              onClick={() => toggleTranscript(story._id)}
                              endIcon={
                                expandedTranscripts.includes(story._id) ? <ExpandLess /> : <ExpandMore />
                              }
                            >
                              {expandedTranscripts.includes(story._id) ? "Collapse" : "Read Transcription"}
                            </Button>
                            <Tooltip title="Copy Transcription" arrow>
                              <IconButton onClick={() => handleCopy(story.transcription!)}>
                                <ContentCopy fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Listen to Transcription" arrow>
                              <IconButton onClick={() => speakText(story.transcription!)}>
                                <VolumeUp fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}

                        {/* Share Buttons with Real Logos */}
                        <Typography variant="subtitle2" fontWeight="bold" mt={2}>Share:</Typography>
                        <Grid container spacing={1} mt={1}>
                          <Grid item>
                            <Tooltip title="Share on X (Twitter)" arrow>
                              <IconButton onClick={() => handleShare(story, "Twitter")}>
                                <img
                                  src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/x.svg"
                                  alt="Twitter"
                                  style={{ width: 20, height: 20 }}
                                />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                          <Grid item>
                            <Tooltip title="Share on WhatsApp" arrow>
                              <IconButton onClick={() => handleShare(story, "WhatsApp")}>
                                <img
                                  src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/whatsapp.svg"
                                  alt="WhatsApp"
                                  style={{ width: 20, height: 20 }}
                                />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                          <Grid item>
                            <Tooltip title="Share on Facebook" arrow>
                              <IconButton onClick={() => handleShare(story, "Facebook")}>
                                <img
                                  src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg"
                                  alt="Facebook"
                                  style={{ width: 20, height: 20 }}
                                />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                        </Grid>

                        {/* Comments */}
                        <Box mt={3}>
                          <Typography variant="subtitle2">Comments:</Typography>
                          <TextField
                            fullWidth
                            size="small"
                            placeholder="Write a comment..."
                            value={newComment[story._id] || ""}
                            onChange={(e) =>
                              setNewComment(prev => ({ ...prev, [story._id]: e.target.value }))
                            }
                            sx={{ mt: 1 }}
                          />
                          <Button
                            variant="contained"
                            size="small"
                            sx={{ mt: 1, backgroundColor: "#9C27B0" }}
                            onClick={() => handleCommentSubmit(story._id)}
                          >
                            Submit
                          </Button>
                          {comments[story._id]?.map((comment) => (
                            <Box key={comment._id} mt={1} p={1} bgcolor="#f5f5f5" borderRadius={2}>
                              <Typography variant="body2">{comment.text}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(comment.createdAt).toLocaleString()}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Fade>
                </Grid>
              ))}
            </Grid>

            <Box display="flex" justifyContent="center" mt={5}>
              <Button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                sx={{ mr: 2, backgroundColor: "#9C27B0", color: "white" }}
              >
                Prev
              </Button>
              <Button
                onClick={() => setPage((p) => p + 1)}
                disabled={page * storiesPerPage >= stories.length}
                sx={{ backgroundColor: "#9C27B0", color: "white" }}
              >
                Next
              </Button>
            </Box>
          </>
        )}
      </Container>
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
};

export default Stories;
