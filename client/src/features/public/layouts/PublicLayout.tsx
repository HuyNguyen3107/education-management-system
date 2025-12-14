import { Box, CssBaseline } from "@mui/material";
import { useState } from "react";
import { PublicSidebar } from "../components/Sidebar/PublicSidebar";
import { PublicHeader } from "../components/Header/PublicHeader";
import { Footer } from "../components/Footer/Footer";
import { Outlet } from "react-router-dom";

const drawerWidth = 280;
const drawerWidthCollapsed = 72;

export const PublicLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSidebarToggle = () => {
    setSidebarOpen((prev) => !prev);
  };

  const currentDrawerWidth = sidebarOpen ? drawerWidth : drawerWidthCollapsed;

  return (
    <Box sx={{ display: "flex", bgcolor: "#f9fafb", minHeight: "100vh" }}>
      <CssBaseline />
      <PublicHeader
        onMenuClick={handleSidebarToggle}
        sidebarOpen={sidebarOpen}
      />
      <PublicSidebar open={sidebarOpen} onToggle={handleSidebarToggle} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          minHeight: "100vh",
          transition: "width 0.3s ease, margin-left 0.3s ease",
        }}
      >
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: "64px", // Height of the Header
          }}
        >
          <Outlet />
        </Box>
        <Footer />
      </Box>
    </Box>
  );
};
