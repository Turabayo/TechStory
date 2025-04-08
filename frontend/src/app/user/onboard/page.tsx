"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Paper,
  CircularProgress,
} from "@mui/material";

const steps = ["Account Setup", "Professional Info", "Technical Skills", "Your Story"];

const OnboardingPage = () => {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    fullName: "",
    profession: "",
    skills: "",
    story: "",
  });
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      console.error("❌ No token found! Redirecting to login...");
      router.push("/auth/signin");
      return;
    }
    console.log("🔍 Token Found:", storedToken);
    setToken(storedToken);
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      try {
        if (!token) {
          router.push("/auth/signin");
          return;
        }

        setLoading(true);
        setError(null);

        const res = await axios.post(
          "http://localhost:5000/api/auth/onboard",
          {
            fullName: formData.fullName.trim(),
            profession: formData.profession.trim(),
            skills: formData.skills
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s !== ""),
            story: formData.story.trim(),
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("✅ Onboarding Complete:", res.data);

        localStorage.setItem("user", JSON.stringify(res.data.user));
        router.push("/user");
      } catch (error: any) {
        console.error("❌ Error during onboarding:", error.response?.data || error.message);
        setError(error.response?.data?.message || "An error occurred during onboarding.");
      } finally {
        setLoading(false);
      }
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  if (!token) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 5, textAlign: "center" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Join <span style={{ color: "#9C27B0" }}>HerTechStory</span>
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 3 }}>
        Inspire others by sharing your journey. Help shape the next generation of women in tech.
      </Typography>

      {error && <Typography sx={{ color: "red", mb: 2 }}>{error}</Typography>}

      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
        {activeStep === 0 && (
          <>
            <Typography variant="h6" gutterBottom>
              Account Setup
            </Typography>
            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              sx={{ my: 2 }}
            />
          </>
        )}

        {activeStep === 1 && (
          <>
            <Typography variant="h6" gutterBottom>
              Professional Info
            </Typography>
            <TextField
              fullWidth
              label="Profession"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              sx={{ my: 2 }}
            />
          </>
        )}

        {activeStep === 2 && (
          <>
            <Typography variant="h6" gutterBottom>
              Technical Skills
            </Typography>
            <TextField
              fullWidth
              label="Skills (comma-separated)"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              sx={{ my: 2 }}
            />
          </>
        )}

        {activeStep === 3 && (
          <>
            <Typography variant="h6" gutterBottom>
              Your Story
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Share your journey in tech..."
              name="story"
              value={formData.story}
              onChange={handleChange}
              sx={{ my: 2 }}
            />
          </>
        )}

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3, bgcolor: "#9C27B0", color: "white" }}
          onClick={handleNext}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : activeStep === steps.length - 1 ? (
            "Complete Onboarding"
          ) : (
            "Next Step"
          )}
        </Button>
      </Paper>
    </Box>
  );
};

export default OnboardingPage;
