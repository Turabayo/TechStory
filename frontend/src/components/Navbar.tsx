// src/components/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: "#6A1B9A" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: "white" }}>
            <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
              HerTechStory
            </Link>
          </Typography>
          <Button color="inherit" component={Link} href="/">
            Home
          </Button>
          <Button color="inherit" component={Link} href="/about">
            About
          </Button>
          <Button color="inherit" component={Link} href="/stories">
            Stories
          </Button>
          <Button color="inherit" component={Link} href="/contact">
            Contact
          </Button>
          <IconButton edge="end" color="inherit" onClick={() => setMenuOpen(true)}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </>
  );
};
export default Navbar;