// src/app/contact/page.tsx
"use client";

import { useState } from "react";
import { Container, Typography, TextField, Button, Box, Alert, Paper } from "@mui/material";
import Navbar from "../../components/Navbar";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="sm" sx={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Paper elevation={4} sx={{ padding: 4, textAlign: "center", width: "100%", maxWidth: 500 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: "#6A1B9A" }}>
            Contact Us
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Have questions? Reach out to us!
          </Typography>

          {success && <Alert severity="success" sx={{ mb: 2 }}>Message sent successfully!</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField 
              fullWidth 
              label="Name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              margin="normal" 
              required 
            />
            <TextField 
              fullWidth 
              label="Email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              margin="normal" 
              required 
            />
            <TextField 
              fullWidth 
              label="Message" 
              multiline 
              rows={4} 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              margin="normal" 
              required 
            />
            <Button 
              type="submit" 
              variant="contained" 
              fullWidth 
              sx={{ mt: 2, bgcolor: "#9C27B0", color: "white", "&:hover": { bgcolor: "#7B1FA2" } }}
            >
              Send Message
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default Contact;
