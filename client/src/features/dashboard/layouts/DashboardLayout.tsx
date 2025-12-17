import { Box, CssBaseline } from '@mui/material';
import { useState } from 'react';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { Header } from '../components/Header/Header';
import { Outlet } from 'react-router-dom';

const drawerWidth = 280;

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSidebarToggle = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f9fafb', minHeight: '100vh' }}>
      <CssBaseline />
      <Header onMenuClick={handleSidebarToggle} sidebarOpen={sidebarOpen} />
      <Sidebar open={sidebarOpen} onToggle={handleSidebarToggle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          width: { 
            sm: `calc(100% - ${sidebarOpen ? drawerWidth : 72}px)` 
          },
          mt: '80px', // Height of the Header
          transition: 'width 0.3s ease',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};
