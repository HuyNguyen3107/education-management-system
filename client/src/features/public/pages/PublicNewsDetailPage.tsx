import {
  Box,
  Typography,
  Paper,
  Chip,
  Container,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { usePublicNewsById } from "../queries/public-news.queries";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { usePageMeta } from "@/hooks/usePageMeta";

export const PublicNewsDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: news, isLoading, isError } = usePublicNewsById(id || "", !!id);

  usePageMeta(
    "Chi tiết tin tức",
    "Xem nội dung chi tiết của tin tức hoặc thông báo được chọn."
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

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ width: "100%", py: 4 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (isError || !news) {
    return (
      <Container maxWidth="xl" sx={{ width: "100%", py: 4 }}>
        <Paper elevation={2} sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="error" gutterBottom>
            Không tìm thấy thông báo
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/public/home")}
            sx={{ mt: 2 }}
          >
            Quay lại trang chủ
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ width: "100%", py: 4 }}>
      <Paper elevation={2} sx={{ p: 4, borderRadius: 2, bgcolor: "#fff" }}>
        {/* Back Button */}
        <Button
          variant="text"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/public/home")}
          sx={{ mb: 3, color: "#B71C1C" }}
        >
          Quay lại
        </Button>

        <Divider sx={{ mb: 3 }} />

        {/* Header */}
        <Box mb={3}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Chip
              label="New"
              size="small"
              sx={{
                bgcolor: "#2196f3",
                color: "#fff",
                fontWeight: 600,
                fontSize: "0.75rem",
                height: "28px",
              }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ ml: "auto", fontSize: "0.875rem" }}
            >
              {formatDate(news.createdAt)}
            </Typography>
          </Box>

          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ mb: 2, color: "#1a1a1a", lineHeight: 1.3 }}
          >
            {news.title}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Content */}
        <Box
          sx={{
            "& p": {
              mb: 2,
              lineHeight: 1.8,
              color: "#374151",
            },
            "& h1, & h2, & h3, & h4, & h5, & h6": {
              mb: 1.5,
              mt: 2,
              fontWeight: 600,
              color: "#1a1a1a",
            },
            "& ul, & ol": {
              mb: 2,
              pl: 3,
            },
            "& li": {
              mb: 0.5,
            },
            "& img": {
              maxWidth: "100%",
              height: "auto",
              borderRadius: 1,
              my: 2,
            },
          }}
          dangerouslySetInnerHTML={{ __html: news.content }}
        />
      </Paper>
    </Container>
  );
};
