// src/components/Hero.tsx
"use client";

import { Container, Typography, Button, Grid } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <Container maxWidth="lg" sx={{ textAlign: "center", py: 10 }}>
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography variant="h2" fontWeight="bold" color="#6A1B9A" gutterBottom>
            Empowering Women, Inspiring Generations
          </Typography>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Share your tech journey and inspire future innovators.
          </Typography>
          <Link href="/auth/signup" passHref>
            <Button variant="contained" sx={{ mt: 3, bgcolor: "#9C27B0", "&:hover": { bgcolor: "#7B1FA2" } }}>
              Get Started
            </Button>
          </Link>
        </Grid>
        <Grid item xs={12} md={6}>
          <Image 
            src="/hero-image.png" 
            alt="HerTechStory" 
            width={500} 
            height={400} 
            priority 
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Hero;