"use client";

import { Drawer, List, ListItem, ListItemText, IconButton, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import BookIcon from '@mui/icons-material/Book';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import { useState } from 'react';
import Link from 'next/link';

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      {/* Menu Button */}
      <IconButton edge="start" sx={{ color: "#E1BEE7" }} onClick={() => setOpen(true)}>
        <MenuIcon />
      </IconButton>
      
      {/* Sidebar Drawer */}
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 250, bgcolor: "#6A1B9A", height: "100%", color: "white", paddingTop: 2 }}>
          <List>
            <ListItem component="div" onClick={() => setOpen(false)}>
              <HomeIcon sx={{ color: "white", marginRight: 1 }} />
              <ListItemText>
                <Link href="/" style={{ textDecoration: "none", color: "white" }}>Home</Link>
              </ListItemText>
            </ListItem>
            <ListItem component="div" onClick={() => setOpen(false)}>
              <InfoIcon sx={{ color: "white", marginRight: 1 }} />
              <ListItemText>
                <Link href="/about" style={{ textDecoration: "none", color: "white" }}>About</Link>
              </ListItemText>
            </ListItem>
            <ListItem component="div" onClick={() => setOpen(false)}>
              <BookIcon sx={{ color: "white", marginRight: 1 }} />
              <ListItemText>
                <Link href="/stories" style={{ textDecoration: "none", color: "white" }}>Stories</Link>
              </ListItemText>
            </ListItem>
            <ListItem component="div" onClick={() => setOpen(false)}>
              <ContactMailIcon sx={{ color: "white", marginRight: 1 }} />
              <ListItemText>
                <Link href="/contact" style={{ textDecoration: "none", color: "white" }}>Contact</Link>
              </ListItemText>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Sidebar;
