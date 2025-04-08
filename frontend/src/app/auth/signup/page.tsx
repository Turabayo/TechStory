"use client";

import { useState } from "react";
import { 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Paper, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Link
} from "@mui/material";
import { useRouter } from "next/navigation";
import axios from "axios";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    if (!acceptedTerms) {
      setError("You must accept the terms and conditions");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
        role: "user",
      });

      if (res.status === 201) {
        setSuccess("Account created successfully! Redirecting to login...");
        setTimeout(() => router.push("/auth/signin"), 2000);
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(
        err.response?.data?.message || 
        err.message || 
        "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTermsOpen = () => {
    setTermsOpen(true);
  };

  const handleTermsClose = () => {
    setTermsOpen(false);
  };

  const handleAcceptTerms = () => {
    setAcceptedTerms(true);
    setTermsOpen(false);
  };

  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        minHeight: "100vh",
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        py: 4
      }}
    >
      <Paper 
        elevation={4} 
        sx={{ 
          padding: { xs: 3, sm: 4 },
          textAlign: "center", 
          width: "100%", 
          maxWidth: 450,
          bgcolor: "background.paper",
          borderRadius: 2
        }}
      >
        <Typography 
          variant="h4" 
          fontWeight="bold" 
          gutterBottom 
          sx={{ color: "#6A1B9A", mb: 2 }}
        >
          Join HerTechStory
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Create your account to share your tech journey
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            required
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            sx={{ mb: 2 }}
          />

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'flex-start',
            mb: 2,
            p: 1,
            border: acceptedTerms ? '1px solid #6A1B9A' : '1px solid transparent',
            borderRadius: 1,
            backgroundColor: acceptedTerms ? 'rgba(106, 27, 154, 0.05)' : 'transparent'
          }}>
            <input
              type="checkbox"
              id="terms-checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              style={{
                marginRight: '10px',
                marginTop: '3px',
                accentColor: '#6A1B9A'
              }}
            />
            <label htmlFor="terms-checkbox" style={{ textAlign: 'left' }}>
              <Typography variant="body2">
                I agree to the{' '}
                <Link 
                  component="button"
                  type="button"
                  onClick={handleTermsOpen}
                  sx={{ 
                    color: "#6A1B9A",
                    fontWeight: 500,
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  Terms and Conditions
                </Link>
              </Typography>
            </label>
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting || !acceptedTerms}
            sx={{
              mt: 2,
              py: 1.5,
              bgcolor: "#6A1B9A",
              '&:hover': {
                bgcolor: "#4A148C",
              },
              '&:disabled': {
                bgcolor: '#E0E0E0',
                color: '#9E9E9E'
              }
            }}
          >
            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 3, color: 'text.secondary' }}>
          Already have an account?{' '}
          <Link 
            href="/auth/signin" 
            sx={{ 
              color: "#6A1B9A",
              fontWeight: 500,
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            Sign In
          </Link>
        </Typography>
      </Paper>

      {/* Terms and Conditions Dialog */}
      <Dialog
        open={termsOpen}
        onClose={handleTermsClose}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle sx={{ 
          color: "#6A1B9A",
          fontWeight: 'bold',
          borderBottom: '1px solid #eee',
          py: 2
        }}>
          HerTechStory Terms and Conditions
        </DialogTitle>
        <DialogContent dividers sx={{ py: 3 }}>
          <Typography variant="body1" paragraph>
            <strong>Effective Date:</strong> {new Date().toLocaleDateString()}
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 2, color: "#6A1B9A" }}>
            1. Definitions
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Platform:</strong> Refers to HerTechStory, including the website, mobile application, and other digital services.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>User:</strong> Any individual accessing or using the platform.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Content:</strong> Includes text, images, videos, audio, and other materials uploaded, posted, or shared on the platform.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>We/Us/Our:</strong> Refers to the HerTechStory team and management.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 4, color: "#6A1B9A" }}>
            2. User Responsibilities
          </Typography>
          
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            2.1 Eligibility
          </Typography>
          <Typography variant="body1" component="div" paragraph>
            <ul style={{ paddingLeft: '20px', marginTop: 0 }}>
              <li>Users must be at least 13 years old. If under 18, parental consent is required.</li>
              <li>Users must provide accurate and truthful information when registering.</li>
            </ul>
          </Typography>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            2.2 Ethical Use
          </Typography>
          <Typography variant="body1" component="div" paragraph>
            <ul style={{ paddingLeft: '20px', marginTop: 0 }}>
              <li>Users must respect others and avoid harmful, offensive, or discriminatory content.</li>
              <li>Users must not misuse the platform for harassment, misinformation, or illegal activities.</li>
              <li>Users are responsible for maintaining the security of their accounts.</li>
            </ul>
          </Typography>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            2.3 Intellectual Property
          </Typography>
          <Typography variant="body1" component="div" paragraph>
            <ul style={{ paddingLeft: '20px', marginTop: 0 }}>
              <li>Users retain ownership of their original content but grant HerTechStory a non-exclusive, worldwide license to use, distribute, and display it for platform purposes.</li>
              <li>Users must not infringe on copyrights, trademarks, or other intellectual property rights.</li>
            </ul>
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 4, color: "#6A1B9A" }}>
            3. Content Guidelines
          </Typography>
          <Typography variant="body1" component="div" paragraph>
            <ul style={{ paddingLeft: '20px', marginTop: 0 }}>
              <li>Content should be respectful, inclusive, and relevant to women in technology.</li>
              <li>Hate speech, discrimination, or inappropriate material is strictly prohibited.</li>
              <li>Users are encouraged to credit original sources when sharing content.</li>
            </ul>
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 4, color: "#6A1B9A" }}>
            4. Privacy and Data Protection
          </Typography>
          <Typography variant="body1" component="div" paragraph>
            <ul style={{ paddingLeft: '20px', marginTop: 0 }}>
              <li>We respect user privacy and handle data in accordance with applicable privacy laws.</li>
              <li>Personal data will only be used for platform functionality and improvement.</li>
              <li>Users can request data deletion by contacting us.</li>
            </ul>
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 4, color: "#6A1B9A" }}>
            5. Platform Moderation and Enforcement
          </Typography>
          <Typography variant="body1" component="div" paragraph>
            <ul style={{ paddingLeft: '20px', marginTop: 0 }}>
              <li>We reserve the right to remove content or suspend accounts that violate these terms.</li>
              <li>Users can report violations, and we will review cases fairly and promptly.</li>
            </ul>
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 4, color: "#6A1B9A" }}>
            6. Liability and Disclaimers
          </Typography>
          <Typography variant="body1" component="div" paragraph>
            <ul style={{ paddingLeft: '20px', marginTop: 0 }}>
              <li>HerTechStory is not responsible for user-generated content.</li>
              <li>We do not guarantee uninterrupted service but will strive for reliability and security.</li>
              <li>Users access and use the platform at their own risk.</li>
            </ul>
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 4, color: "#6A1B9A" }}>
            7. Changes to These Terms
          </Typography>
          <Typography variant="body1" component="div" paragraph>
            <ul style={{ paddingLeft: '20px', marginTop: 0 }}>
              <li>We may update these terms occasionally. Users will be notified of significant changes.</li>
              <li>Continued use after updates constitutes acceptance of the revised terms.</li>
            </ul>
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 4, color: "#6A1B9A" }}>
            8. Contact Information
          </Typography>
          <Typography variant="body1" paragraph>
            For any questions or concerns, please contact us at{' '}
            <Link href="mailto:turabayoimmacule@gmail.com" sx={{ color: "#6A1B9A" }}>
              turabayoimmacule@gmail.com
            </Link>.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={handleTermsClose}
            sx={{ color: "#6A1B9A" }}
          >
            Close
          </Button>
          <Button 
            variant="contained"
            onClick={handleAcceptTerms}
            sx={{ 
              bgcolor: "#6A1B9A",
              '&:hover': { bgcolor: "#4A148C" }
            }}
          >
            I Accept
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SignUp;