"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Box,
  CircularProgress,
  Paper,
  Switch,
  FormControlLabel,
  Stack,
  Divider,
} from "@mui/material";

const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/auth/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/auth/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      console.error("Failed to update role:", err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Manage Users
      </Typography>

      {loading ? (
        <CircularProgress sx={{ mt: 5, display: "block", mx: "auto" }} />
      ) : (
        users.map((user) => (
          <Paper
            key={user._id}
            sx={{ p: 2, my: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}
          >
            <Box>
              <Typography fontWeight="bold">{user.name}</Typography>
              <Typography color="textSecondary">{user.email}</Typography>
            </Box>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography>{user.role === "admin" ? "Admin" : "User"}</Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={user.role === "admin"}
                    onChange={() => toggleRole(user._id, user.role)}
                  />
                }
                label="Promote"
              />
            </Stack>
          </Paper>
        ))
      )}
    </Box>
  );
};

export default AdminUsers;
