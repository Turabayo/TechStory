"use client";
// Verified: use client at top
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  Chip,
  CircularProgress,
} from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";

const PendingApprovals = () => {
  const [pendingStories, setPendingStories] = useState([]);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/stories/admin/pending",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPendingStories(res.data);
    } catch (err) {
      console.error("Error fetching pending stories", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await axios.put(
        `http://localhost:5000/api/stories/admin/${id}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchPending();
    } catch (err) {
      console.error("Error approving story", err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await axios.put(
        `http://localhost:5000/api/stories/admin/${id}/reject`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchPending();
    } catch (err) {
      console.error("Error rejecting story", err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Pending Approvals
      </Typography>

      {loading ? (
        <CircularProgress sx={{ display: "block", margin: "auto", mt: 5 }} />
      ) : (
        <Grid container spacing={3}>
          {pendingStories.map((story: any) => (
            <Grid item xs={12} md={6} key={story._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {story.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                  >
                    {story.content?.substring(0, 100)}...
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                    <Chip label={story.storyType} color="info" size="small" />
                    <Chip
                      label={story.status}
                      color="warning"
                      size="small"
                    />
                  </Box>

                  <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                    <Button
                      variant="contained"
                      size="small"
                      color="success"
                      startIcon={<CheckCircle />}
                      onClick={() => handleApprove(story._id)}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      startIcon={<Cancel />}
                      onClick={() => handleReject(story._id)}
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
    </Box>
  );
};

export default PendingApprovals;
