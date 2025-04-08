// src/theme.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#007BFF", // Electric Blue
    },
    secondary: {
      main: "#B388FF", // Soft Purple
    },
    error: {
      main: "#FF4081", // Magenta
    },
    background: {
      default: "#F5F5F5", // Light Gray
    },
    text: {
      primary: "#1E1E1E", // Dark Gray for text contrast
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
    h3: {
      fontWeight: 700,
    },
    button: {
      textTransform: "none",
    },
  },
});

export default theme;