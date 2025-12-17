import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePublicNews } from "../queries/public-news.queries";
import CampaignIcon from "@mui/icons-material/Campaign";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import { usePageMeta } from "@/hooks/usePageMeta";

export const PublicHomePage = () => {
  const navigate = useNavigate();
  const { data: newsData, isLoading } = usePublicNews({
    page: 0,
    size: 10,
    sort: "createdAt,desc",
  });

  usePageMeta(
    "Trang chủ - Cổng thông tin đào tạo",
    "Trang chủ hiển thị các tin tức và thông báo mới nhất dành cho sinh viên."
  );

  const newsList = Array.isArray(newsData) ? newsData : newsData?.content || [];
  const totalElements = Array.isArray(newsData)
    ? newsData.length
    : newsData?.totalElements || 0;

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

  return (
    <Container maxWidth="xl" sx={{ width: "100%", pb: 4 }}>
      <Box>
        {/* Tin tức Section */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
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
                Tin tức
              </Typography>
            </Box>
            <Box
              component="button"
              onClick={() => navigate("/public/home/all")}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: "#B71C1C",
                textDecoration: "none",
                fontWeight: 600,
                border: "none",
                background: "none",
                cursor: "pointer",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Xem tiếp
              <ArrowForwardIcon sx={{ fontSize: 18 }} />
            </Box>
          </Box>

          {isLoading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              py={8}
            >
              <CircularProgress />
            </Box>
          ) : (
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
                  {featuredAnnouncements.length > 0 ? (
                    featuredAnnouncements.map((announcement, index) => (
                      <Box key={announcement.id || index}>
                        <Card
                          elevation={3}
                          onClick={() =>
                            navigate(`/public/home/${announcement.id}`)
                          }
                          sx={{
                            height: "100%",
                            position: "relative",
                            overflow: "hidden",
                            borderRadius: 2,
                            cursor: "pointer",
                            transition:
                              "transform 0.2s ease, box-shadow 0.2s ease",
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
                              clipPath:
                                "polygon(0 0, 100% 0, 80% 100%, 0 100%)",
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
                                TIN TỨC
                              </Typography>
                            </Box>

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
                              variant="h6"
                              fontWeight={600}
                              sx={{ mb: 1, color: "#333" }}
                            >
                              {announcement.title}
                            </Typography>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: "vertical",
                                lineHeight: 1.5,
                              }}
                            >
                              {getPreviewText(announcement.content, 150)}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Box>
                    ))
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ p: 2, textAlign: "center" }}
                    >
                      Chưa có tin tức nổi bật
                    </Typography>
                  )}
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
                          onClick={() =>
                            navigate(`/public/home/${announcement.id}`)
                          }
                          sx={{
                            p: 2,
                            borderRadius: 1,
                            bgcolor: "#f9fafb",
                            cursor: "pointer",
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
                                fontWeight: 500,
                              }}
                            >
                              {announcement.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#6b7280",
                                lineHeight: 1.5,
                                fontSize: "0.85rem",
                                mt: 0.5,
                              }}
                            >
                              {getPreviewText(announcement.content, 100)}
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
                      Chưa có tin tức mới
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};
