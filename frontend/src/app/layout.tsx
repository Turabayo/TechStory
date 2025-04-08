// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Box, Typography, IconButton } from "@mui/material";
import { Facebook, Twitter, Instagram, LinkedIn } from "@mui/icons-material";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HerTechStory",
  description: "Empowering women in technology",
};

function Footer() {
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 3, 
        bgcolor: "#f5f5f5", 
        textAlign: "center", 
        borderTop: "1px solid #e0e0e0",
        mt: 'auto' 
      }}
    >
      <Typography variant="body2" color="textSecondary" gutterBottom>
        © {new Date().getFullYear()} HerTechStory. All rights reserved.
      </Typography>
      <Box sx={{ mt: 1 }}>
        <IconButton href="https://facebook.com" target="_blank" aria-label="Facebook">
          <Facebook sx={{ color: "#6A1B9A" }} />
        </IconButton>
        <IconButton href="https://twitter.com" target="_blank" aria-label="Twitter">
          <Twitter sx={{ color: "#6A1B9A" }} />
        </IconButton>
        <IconButton href="https://instagram.com" target="_blank" aria-label="Instagram">
          <Instagram sx={{ color: "#6A1B9A" }} />
        </IconButton>
        <IconButton href="https://linkedin.com" target="_blank" aria-label="LinkedIn">
          <LinkedIn sx={{ color: "#6A1B9A" }} />
        </IconButton>
      </Box>
    </Box>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}