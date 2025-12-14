import { Box, CssBaseline } from "@mui/material";
import { useState } from "react";
import { PublicSidebar } from "../components/Sidebar/PublicSidebar";
import { PublicHeader } from "../components/Header/PublicHeader";
import { Footer } from "../components/Footer/Footer";
import { Outlet } from "react-router-dom";

const drawerWidth = 280;

export const PublicLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSidebarToggle = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", bgcolor: "#f9fafb", minHeight: "100vh" }}>
      <CssBaseline />
      <PublicHeader onMenuClick={handleSidebarToggle} sidebarOpen={sidebarOpen} />
      <PublicSidebar open={sidebarOpen} onToggle={handleSidebarToggle} />
      <Box
        component="main"
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          p: 4,
          width: {
            sm: `calc(100% - ${sidebarOpen ? drawerWidth : 72}px)`,
          },
          ml: {
            sm: `${sidebarOpen ? drawerWidth : 72}px`,
          },
          mt: "80px", // Height of the Header
          transition: "width 0.3s ease, margin-left 0.3s ease",
          minHeight: "calc(100vh - 80px)",
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Outlet />
        </Box>
        <Footer />
      </Box>
    </Box>
  );
};

