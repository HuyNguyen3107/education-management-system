import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Chip,
  Container,
  Link,
  Fab,
  Divider,
  Stack,
} from "@mui/material";
import { useState, useEffect } from "react";
import { usePublicNews } from "../queries/public-news.queries";
import CampaignIcon from "@mui/icons-material/Campaign";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import PhoneIcon from "@mui/icons-material/Phone";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";

export const PublicHomePage = () => {
  const { data: newsData } = usePublicNews({
    page: 0,
    size: 10,
    sort: "createdAt,desc",
  });

  const newsList = Array.isArray(newsData) ? newsData : newsData?.content || [];
  const totalElements = Array.isArray(newsData)
    ? newsData.length
    : newsData?.totalElements || 0;

  // Update total news count in localStorage for footer stats
  useEffect(() => {
    if (totalElements > 0) {
      localStorage.setItem("totalNews", totalElements.toString());
    }
  }, [totalElements]);

  // Format date as DD/MM/YYYY
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return dateString;
    }
  };

  // Helper function to extract preview text from HTML
  const getPreviewText = (html: string, maxLength: number = 100) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    const text = tmp.textContent || tmp.innerText || "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  // Get featured announcements (first 2)
  const featuredAnnouncements = newsList.slice(0, 2);
  // Get latest announcements (next 3)
  const latestAnnouncements = newsList.slice(2, 5);

  // Statistics data
  const [stats] = useState({
    currentAccess: 482,
    studentLogins: 482,
    teacherLogins: 0,
  });

  return (
    <Container maxWidth="xl" sx={{ width: "100%", pb: 4 }}>
      <Box>
        {/* Thông báo Section */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            bgcolor: "#fff",
          }}
        >
          {/* Section Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <CampaignIcon sx={{ fontSize: 28, color: "#B71C1C" }} />
              <Typography variant="h5" fontWeight={700} color="#333">
                Thông báo
              </Typography>
            </Box>
            <Link
              href="#"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: "#B71C1C",
                textDecoration: "none",
                fontWeight: 600,
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Xem tiếp
              <ArrowForwardIcon sx={{ fontSize: 18 }} />
            </Link>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 3,
            }}
          >
            {/* Featured Announcements - Left Side */}
            <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 50%" } }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {featuredAnnouncements.map((announcement, index) => (
                  <Box key={announcement.id || index}>
                    <Card
                      elevation={3}
                      sx={{
                        height: "100%",
                        position: "relative",
                        overflow: "hidden",
                        borderRadius: 2,
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: 6,
                        },
                      }}
                    >
                      {/* Decorative red shape overlay */}
                      <Box
                        sx={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          width: "120px",
                          height: "100%",
                          background:
                            "linear-gradient(135deg, #B71C1C 0%, #8B0000 100%)",
                          clipPath: "polygon(0 0, 100% 0, 80% 100%, 0 100%)",
                          zIndex: 1,
                        }}
                      />

                      <CardContent
                        sx={{ position: "relative", zIndex: 2, p: 3 }}
                      >
                        <Box mb={2}>
                          <Typography
                            variant="h4"
                            fontWeight={700}
                            sx={{ mb: 1, color: "#1a1a1a" }}
                          >
                            THÔNG BÁO
                          </Typography>
                          <Chip
                            label="TỪ PHÒNG GIÁO VỤ"
                            size="small"
                            sx={{
                              bgcolor: "#ff9800",
                              color: "#fff",
                              fontWeight: 600,
                              fontSize: "0.7rem",
                              height: "24px",
                            }}
                          />
                        </Box>

                        {/* Image placeholder */}
                        <Box
                          sx={{
                            width: "100%",
                            height: "180px",
                            bgcolor: "#f0f0f0",
                            borderRadius: 1,
                            mb: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundImage:
                              "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2U1ZTdlOSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZTwvdGV4dD48L3N2Zz4=')",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        />

                        <Box
                          display="flex"
                          alignItems="center"
                          gap={1}
                          mb={1.5}
                        >
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontSize: "0.85rem" }}
                          >
                            {formatDate(announcement.createdAt)}
                          </Typography>
                          <Chip
                            label="New"
                            size="small"
                            sx={{
                              bgcolor: "#2196f3",
                              color: "#fff",
                              fontWeight: 600,
                              fontSize: "0.7rem",
                              height: "20px",
                            }}
                          />
                        </Box>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            lineHeight: 1.5,
                          }}
                        >
                          {getPreviewText(announcement.content, 120)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Latest Announcements List - Right Side */}
            <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 50%" } }}>
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {latestAnnouncements.length > 0 ? (
                  latestAnnouncements.map((announcement, index) => (
                    <Box key={announcement.id || index}>
                      <Box
                        display="flex"
                        alignItems="flex-start"
                        gap={1.5}
                        sx={{
                          p: 2,
                          borderRadius: 1,
                          bgcolor: "#f9fafb",
                          transition: "background-color 0.2s ease",
                          "&:hover": {
                            bgcolor: "#f3f4f6",
                          },
                        }}
                      >
                        <DoubleArrowIcon
                          sx={{ fontSize: 20, color: "#B71C1C", mt: 0.5 }}
                        />
                        <Box flex={1}>
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            mb={0.5}
                          >
                            <Chip
                              label="New"
                              size="small"
                              sx={{
                                bgcolor: "#2196f3",
                                color: "#fff",
                                fontWeight: 600,
                                fontSize: "0.7rem",
                                height: "18px",
                              }}
                            />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ ml: "auto", fontSize: "0.8rem" }}
                            >
                              {formatDate(announcement.createdAt)}
                            </Typography>
                          </Box>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#333",
                              lineHeight: 1.6,
                              fontSize: "0.9rem",
                            }}
                          >
                            {getPreviewText(
                              announcement.title || announcement.content,
                              150
                            )}
                          </Typography>
                        </Box>
                      </Box>
                      {index < latestAnnouncements.length - 1 && (
                        <Divider sx={{ mt: 2 }} />
                      )}
                    </Box>
                  ))
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ p: 2 }}
                  >
                    Chưa có thông báo mới
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* THỐNG KÊ TRUY CẬP Section */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            borderRadius: 2,
            bgcolor: "#fff",
            position: "relative",
          }}
        >
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{ mb: 3, color: "#B71C1C" }}
          >
            THỐNG KÊ TRUY CẬP
          </Typography>

          <Stack spacing={2}>
            {/* Đang truy cập */}
            <Box
              display="flex"
              alignItems="center"
              gap={2}
              sx={{
                p: 2,
                borderRadius: 1,
                bgcolor: "#f9fafb",
                "&:hover": {
                  bgcolor: "#f3f4f6",
                },
              }}
            >
              <PeopleIcon sx={{ fontSize: 28, color: "#666" }} />
              <Typography variant="body1" sx={{ flex: 1, fontWeight: 500 }}>
                Đang truy cập
              </Typography>
              <Chip
                label={stats.currentAccess}
                sx={{
                  bgcolor: "#B71C1C",
                  color: "#fff",
                  fontWeight: 700,
                  minWidth: "60px",
                  justifyContent: "center",
                }}
              />
            </Box>

            {/* SV đăng nhập */}
            <Box
              display="flex"
              alignItems="center"
              gap={2}
              sx={{
                p: 2,
                borderRadius: 1,
                bgcolor: "#f9fafb",
                "&:hover": {
                  bgcolor: "#f3f4f6",
                },
              }}
            >
              <SchoolIcon sx={{ fontSize: 28, color: "#666" }} />
              <Typography variant="body1" sx={{ flex: 1, fontWeight: 500 }}>
                SV đăng nhập
              </Typography>
              <Chip
                label={stats.studentLogins}
                sx={{
                  bgcolor: "#B71C1C",
                  color: "#fff",
                  fontWeight: 700,
                  minWidth: "60px",
                  justifyContent: "center",
                }}
              />
            </Box>

            {/* GV đăng nhập */}
            <Box
              display="flex"
              alignItems="center"
              gap={2}
              sx={{
                p: 2,
                borderRadius: 1,
                bgcolor: "#f9fafb",
                "&:hover": {
                  bgcolor: "#f3f4f6",
                },
              }}
            >
              <PersonIcon sx={{ fontSize: 28, color: "#666" }} />
              <Typography variant="body1" sx={{ flex: 1, fontWeight: 500 }}>
                GV đăng nhập
              </Typography>
              <Chip
                label={stats.teacherLogins}
                sx={{
                  bgcolor: "#B71C1C",
                  color: "#fff",
                  fontWeight: 700,
                  minWidth: "60px",
                  justifyContent: "center",
                }}
              />
            </Box>
          </Stack>

          {/* Floating Action Button */}
          <Fab
            color="primary"
            aria-label="phone"
            sx={{
              position: "absolute",
              bottom: 24,
              right: 24,
              bgcolor: "#B71C1C",
              "&:hover": {
                bgcolor: "#8B0000",
              },
              width: 56,
              height: 56,
            }}
          >
            <PhoneIcon sx={{ color: "#fff" }} />
          </Fab>
        </Paper>
      </Box>
    </Container>
  );
};
