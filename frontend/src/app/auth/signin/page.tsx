"use client";

import { useState, useEffect } from "react";
import { Container, TextField, Button, Typography, Box, Paper, Checkbox, FormControlLabel, Alert } from "@mui/material";
import { useRouter } from "next/navigation";
import axios from "axios";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  }, []);

  if (!mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });

      if (res.status === 200) {
        const { token, user } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("role", user.role);

        console.log("🎯 Logged in user:", user);
        setSuccess("✅ Login successful!");
        setError("");

        if (user.role === "admin") {
          router.push("/admin");
        } else if (!user.onboarded) {
          router.push("/user/onboard");
        } else {
          router.push("/user");
        }
      }
    } catch (err) {
      console.error("❌ Login failed:", err);
      setError("Invalid credentials. Please try again.");
      setSuccess("");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Paper elevation={4} sx={{ padding: 4, textAlign: "center", width: "100%", maxWidth: 400, bgcolor: "white" }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: "#6A1B9A" }}>
          Sign In
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Enter your email and password to sign in
        </Typography>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          <FormControlLabel control={<Checkbox sx={{ color: "#6A1B9A" }} />} label="Remember me" />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, bgcolor: "#9C27B0", color: "white", "&:hover": { bgcolor: "#7B1FA2" } }}
          >
            Sign In
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Don't have an account?{" "}
          <a href="/auth/signup" style={{ fontWeight: "bold", color: "#6A1B9A" }}>
            Sign Up
          </a>
        </Typography>
      </Paper>
    </Container>
  );
};

export default SignIn;