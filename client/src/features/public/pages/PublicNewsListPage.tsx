import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Chip,
  Container,
  Button,
  CircularProgress,
  Pagination,
  Stack,
} from "@mui/material";
import { useState } from "react";
import { usePublicNews } from "../queries/public-news.queries";
import { useNavigate } from "react-router-dom";
import CampaignIcon from "@mui/icons-material/Campaign";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { usePageMeta } from "@/hooks/usePageMeta";

export const PublicNewsListPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);

  const { data: newsData, isLoading } = usePublicNews({
    page,
    size: rowsPerPage,
    sort: "createdAt,desc",
  });

  const newsList = Array.isArray(newsData) ? newsData : newsData?.content || [];
  const totalPages = Array.isArray(newsData) ? 1 : newsData?.totalPages || 1;

  usePageMeta(
    "Danh sách tin tức",
    "Xem đầy đủ danh sách tin tức và thông báo từ hệ thống."
  );

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
  const getPreviewText = (html: string, maxLength: number = 150) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    const text = tmp.textContent || tmp.innerText || "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value - 1); // Pagination is 1-based, but API is 0-based
  };

  return (
    <Container maxWidth="xl" sx={{ width: "100%", pb: 4 }}>
      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: "#fff",
        }}
      >
        {/* Header */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={3}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Button
              variant="text"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/public/home")}
              sx={{ color: "#B71C1C" }}
            >
              Quay lại
            </Button>
            <Box display="flex" alignItems="center" gap={1}>
              <CampaignIcon sx={{ fontSize: 28, color: "#B71C1C" }} />
              <Typography variant="h5" fontWeight={700} color="#333">
                Tất cả thông báo
              </Typography>
            </Box>
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
        ) : newsList.length === 0 ? (
          <Paper elevation={2} sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body1" color="text.secondary">
              Chưa có thông báo nào
            </Typography>
          </Paper>
        ) : (
          <>
            <Stack spacing={2} mb={4}>
              {newsList.map((news) => (
                <Card
                  key={news.id}
                  elevation={2}
                  onClick={() => navigate(`/public/home/${news.id}`)}
                  sx={{
                    cursor: "pointer",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1}
                      mb={1.5}
                      flexWrap="wrap"
                    >
                      <Chip
                        label="New"
                        size="small"
                        sx={{
                          bgcolor: "#2196f3",
                          color: "#fff",
                          fontWeight: 600,
                          fontSize: "0.7rem",
                          height: "22px",
                        }}
                      />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: "0.85rem" }}
                      >
                        {formatDate(news.createdAt)}
                      </Typography>
                    </Box>
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      sx={{ mb: 1.5, color: "#333" }}
                    >
                      {news.title}
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
                        lineHeight: 1.6,
                      }}
                    >
                      {getPreviewText(news.content, 200)}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Stack>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                  count={totalPages}
                  page={page + 1}
                  onChange={handlePageChange}
                  color="primary"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      "&.Mui-selected": {
                        bgcolor: "#B71C1C",
                        color: "#fff",
                        "&:hover": {
                          bgcolor: "#8B0000",
                        },
                      },
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Paper>
    </Container>
  );
};
