import { Box, Container, Typography, Grid, Paper } from "@mui/material";
import {
  People as PeopleIcon,
  Visibility as VisibilityIcon,
  TrendingUp as TrendingUpIcon,
  Today as TodayIcon,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import React from "react";

export const Footer = () => {
  const [stats, setStats] = useState({
    totalVisits: 0,
    onlineUsers: 0,
    todayVisits: 0,
    totalNews: 0,
  });

  // Load stats from localStorage or initialize
  useEffect(() => {
    // Check if already visited in this session
    const sessionVisited = sessionStorage.getItem("visited");
    
    if (!sessionVisited) {
      // Mark as visited in this session
      sessionStorage.setItem("visited", "true");
      
      // Load total visits
      const totalVisits = parseInt(
        localStorage.getItem("totalVisits") || "0",
        10
      );
      
      // Increment visit count
      const newTotalVisits = totalVisits + 1;
      localStorage.setItem("totalVisits", newTotalVisits.toString());
      
      // Load today's visits
      const today = new Date().toDateString();
      const todayVisitsKey = `visits_${today}`;
      const todayVisits = parseInt(
        localStorage.getItem(todayVisitsKey) || "0",
        10
      );
      const newTodayVisits = todayVisits + 1;
      localStorage.setItem(todayVisitsKey, newTodayVisits.toString());

      // Update stats
      const onlineUsers = Math.floor(Math.random() * 50) + 10;
      const totalNews = parseInt(localStorage.getItem("totalNews") || "0", 10);

      setStats({
        totalVisits: newTotalVisits,
        onlineUsers,
        todayVisits: newTodayVisits,
        totalNews,
      });
    } else {
      // Just load existing stats without incrementing
      const totalVisits = parseInt(
        localStorage.getItem("totalVisits") || "0",
        10
      );
      
      const today = new Date().toDateString();
      const todayVisitsKey = `visits_${today}`;
      const todayVisits = parseInt(
        localStorage.getItem(todayVisitsKey) || "0",
        10
      );

      const onlineUsers = Math.floor(Math.random() * 50) + 10;
      const totalNews = parseInt(localStorage.getItem("totalNews") || "0", 10);

      setStats({
        totalVisits,
        onlineUsers,
        todayVisits,
        totalNews,
      });
    }
  }, []);

  const statItems = [
    {
      label: "Tổng lượt truy cập",
      value: stats.totalVisits.toLocaleString("vi-VN"),
      icon: <VisibilityIcon />,
      color: "#3b82f6",
    },
    {
      label: "Đang trực tuyến",
      value: stats.onlineUsers.toString(),
      icon: <PeopleIcon />,
      color: "#10b981",
    },
    {
      label: "Lượt truy cập hôm nay",
      value: stats.todayVisits.toLocaleString("vi-VN"),
      icon: <TodayIcon />,
      color: "#f59e0b",
    },
    {
      label: "Tổng số tin tức",
      value: stats.totalNews.toLocaleString("vi-VN"),
      icon: <TrendingUpIcon />,
      color: "#ef4444",
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: "linear-gradient(180deg, #B71C1C 0%, #8B0000 100%)",
        color: "#fff",
        py: 1.5,
        px: 2,
        width: "100%",
        margin: 0,
      }}
    >
      <Container maxWidth="xl" sx={{ px: 2 }}>
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ mb: 1, textAlign: "center", fontSize: "1rem" }}
        >
          Thống kê truy cập
        </Typography>
        <Grid container spacing={1.5}>
          {statItems.map((item, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Paper
                elevation={2}
                sx={{
                  p: 1.5,
                  textAlign: "center",
                  background: "rgba(255, 255, 255, 0.15)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  transition: "transform 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    background: "rgba(255, 255, 255, 0.2)",
                  },
                }}
              >
                <Box
                  sx={{
                    color: item.color,
                    mb: 0.5,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {React.cloneElement(item.icon, { sx: { fontSize: 20 } })}
                </Box>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ mb: 0.25, color: "#fff", fontSize: "1.25rem" }}
                >
                  {item.value}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "0.7rem" }}
                >
                  {item.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
        <Box
          sx={{
            mt: 1,
            pt: 1,
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            textAlign: "center",
          }}
        >
          <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.7rem" }}>
            © 2025 Education Management System. Tất cả quyền được bảo lưu.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

