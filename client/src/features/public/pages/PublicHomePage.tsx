import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Grid,
  Chip,
} from "@mui/material";
import { useState } from "react";
import { usePublicNews } from "../queries/public-news.queries";
import ArticleIcon from "@mui/icons-material/Article";
import VisibilityIcon from "@mui/icons-material/Visibility";

export const PublicHomePage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);

  const { data: newsData, isLoading } = usePublicNews({
    page,
    size: rowsPerPage,
    sort: "createdAt,desc",
  });

  const newsList = Array.isArray(newsData) ? newsData : newsData?.content || [];
  const totalElements = Array.isArray(newsData)
    ? newsData.length
    : newsData?.totalElements || 0;
  const totalPages = Array.isArray(newsData)
    ? 1
    : newsData?.totalPages || 1;

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${day} tháng ${month}, ${year}`;
    } catch {
      return dateString;
    }
  };

  // Helper function to extract preview text from HTML
  const getPreviewText = (html: string, maxLength: number = 150) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    const text = tmp.textContent || tmp.innerText || "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mb: 4,
          background: "linear-gradient(135deg, #B71C1C 0%, #8B0000 100%)",
          color: "#fff",
          borderRadius: 2,
        }}
      >
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Chào mừng đến với EMS
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
          Hệ thống quản lý giáo dục hiện đại
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.8 }}>
          Nơi cung cấp thông tin mới nhất về các hoạt động, tin tức và thông báo
          quan trọng của trường.
        </Typography>
      </Paper>

      {/* News Section */}
      <Box mb={3}>
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          mb={3}
        >
          <ArticleIcon sx={{ fontSize: 32, color: "#B71C1C" }} />
          <Typography variant="h4" fontWeight={700}>
            Tin tức mới nhất
          </Typography>
        </Box>

        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={8}>
            <CircularProgress />
          </Box>
        ) : newsList.length === 0 ? (
          <Paper elevation={2} sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body1" color="text.secondary">
              Chưa có tin tức nào
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {newsList.map((news) => (
              <Grid item xs={12} md={6} lg={4} key={news.id}>
                <Card
                  elevation={2}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Chip
                        label="Tin tức"
                        size="small"
                        sx={{
                          bgcolor: "#B71C1C",
                          color: "#fff",
                          fontWeight: 600,
                        }}
                      />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ ml: "auto" }}
                      >
                        {formatDate(news.createdAt)}
                      </Typography>
                    </Box>
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      gutterBottom
                      sx={{
                        mb: 2,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
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
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {getPreviewText(news.content)}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<VisibilityIcon />}
                      sx={{
                        borderColor: "#B71C1C",
                        color: "#B71C1C",
                        "&:hover": {
                          borderColor: "#8B0000",
                          bgcolor: "rgba(183, 28, 28, 0.04)",
                        },
                      }}
                      onClick={() => {
                        // Open detail dialog or navigate
                        // You can add a detail view here
                      }}
                    >
                      Xem chi tiết
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" gap={2} mt={4}>
            <Button
              variant="outlined"
              disabled={page === 0}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Trước
            </Button>
            <Typography variant="body1" sx={{ alignSelf: "center" }}>
              Trang {page + 1} / {totalPages}
            </Typography>
            <Button
              variant="outlined"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Sau
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

