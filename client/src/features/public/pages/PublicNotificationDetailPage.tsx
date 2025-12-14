import {
  Box,
  Typography,
  Paper,
  Container,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { usePublicNotificationById } from "../queries/public-notifications.queries";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export const PublicNotificationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: notification,
    isLoading,
    isError,
  } = usePublicNotificationById(id || "", !!id);

  // Format date as DD/MM/YYYY HH:MM
  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${day}/${month}/${year} ${hours}:${minutes}`;
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

  if (isError || !notification) {
    return (
      <Container maxWidth="xl" sx={{ width: "100%", py: 4 }}>
        <Paper elevation={2} sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="error" gutterBottom>
            Không tìm thấy thông báo
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/public/home/admin-notifications")}
            sx={{ mt: 2 }}
          >
            Quay lại
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
          onClick={() => navigate("/public/home/admin-notifications")}
          sx={{ mb: 3, color: "#B71C1C" }}
        >
          Quay lại
        </Button>

        <Divider sx={{ mb: 3 }} />

        {/* Header */}
        <Box mb={3}>
          <Box
            display="flex"
            alignItems="center"
            gap={2}
            mb={2}
            flexWrap="wrap"
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: "0.875rem" }}
            >
              Ngày gửi: {formatDateTime(notification.createdAt)}
            </Typography>
            {notification.seenDate && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: "0.875rem" }}
              >
                Ngày xem: {formatDateTime(notification.seenDate)}
              </Typography>
            )}
          </Box>

          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ mb: 2, color: "#1a1a1a", lineHeight: 1.3 }}
          >
            {notification.title}
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
          dangerouslySetInnerHTML={{ __html: notification.content }}
        />
      </Paper>
    </Container>
  );
};
