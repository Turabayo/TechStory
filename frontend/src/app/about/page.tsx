// src/app/about/page.tsx
"use client";

import { Container, Typography, Box } from "@mui/material";
import Navbar from "../../components/Navbar";

const About = () => {
  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Box textAlign="center">
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            About HerTechStory
          </Typography>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Preserving Women’s Voices in Tech
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            HerTechStory is an AI-powered platform dedicated to preserving and sharing the stories of women in technology.
            Our mission is to empower women by amplifying their voices, providing inspiration, and fostering a supportive
            community.
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default About;
