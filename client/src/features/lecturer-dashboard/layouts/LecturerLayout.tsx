import { Box, CssBaseline } from "@mui/material";
import { useState } from "react";
import { Header } from "@/features/dashboard/components/Header/Header";
import { LecturerSidebar } from "../components/LecturerSidebar";
import { Outlet } from "react-router-dom";

const drawerWidth = 280;

export const LecturerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSidebarToggle = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: "flex", bgcolor: "#f9fafb", minHeight: "100vh" }}>
      <CssBaseline />
      <Header onMenuClick={handleSidebarToggle} sidebarOpen={sidebarOpen} />
      <LecturerSidebar open={sidebarOpen} onToggle={handleSidebarToggle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          width: {
            sm: `calc(100% - ${sidebarOpen ? drawerWidth : 72}px)`,
          },
          mt: "80px", // Height of the Header
          transition: "width 0.3s ease",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};
