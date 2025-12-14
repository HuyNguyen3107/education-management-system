import {
  Box,
  Typography,
  Paper,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  IconButton,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { usePublicNotifications } from "../queries/public-notifications.queries";
import { useEffect, useState } from "react";
import CampaignIcon from "@mui/icons-material/Campaign";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

// Helper function to get userId from localStorage
const getUserIdFromLocalStorage = (): string => {
  try {
    const authStorage = localStorage.getItem("auth-storage");
    if (authStorage) {
      const authData = JSON.parse(authStorage);
      if (authData?.state?.user?.id) {
        return authData.state.user.id;
      }
    }
  } catch (error) {
    console.error("Error reading userId from localStorage:", error);
  }
  return "";
};

export const PublicAdminNotificationsPage = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string>("");

  // Get userId from localStorage on component mount and listen for changes
  useEffect(() => {
    const id = getUserIdFromLocalStorage();
    setUserId(id);

    // Listen for storage changes (e.g., when user logs in/out in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "auth-storage") {
        const newId = getUserIdFromLocalStorage();
        setUserId(newId);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const { data: notifications, isLoading } = usePublicNotifications(userId);

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

  const handleViewNotification = (id: string) => {
    navigate(`/public/home/notification/${id}`);
  };

  return (
    <Container maxWidth="xl" sx={{ width: "100%", pb: 4 }}>
      <Paper
        elevation={2}
        sx={{
          borderRadius: 2,
          bgcolor: "#fff",
          overflow: "hidden",
        }}
      >
        {/* Red Bar at Top */}
        <Box
          sx={{
            width: "100%",
            height: "4px",
            bgcolor: "#B71C1C",
          }}
        />

        {/* Header Section */}
        <Box sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" gap={1.5} mb={2}>
            <CampaignIcon sx={{ fontSize: 28, color: "#E91E63" }} />
            <Typography variant="h5" fontWeight={700} color="#333">
              THÔNG BÁO
            </Typography>
          </Box>

          <Divider
            sx={{
              borderColor: "#B71C1C",
              borderWidth: 1,
            }}
          />
        </Box>

        {/* Table Section */}
        {isLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            py={8}
          >
            <CircularProgress />
          </Box>
        ) : !notifications || notifications.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body1" color="text.secondary">
              Chưa có thông báo nào
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "#333",
                      borderBottom: "2px solid #B71C1C",
                    }}
                  >
                    STT
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "#333",
                      borderBottom: "2px solid #B71C1C",
                    }}
                  >
                    Tiêu đề
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: 700,
                      color: "#333",
                      borderBottom: "2px solid #B71C1C",
                    }}
                  >
                    Ngày gửi
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: 700,
                      color: "#333",
                      borderBottom: "2px solid #B71C1C",
                    }}
                  >
                    Ngày xem
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: 700,
                      color: "#333",
                      borderBottom: "2px solid #B71C1C",
                    }}
                  >
                    Xem
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {notifications.map((notification, index) => (
                  <TableRow
                    key={notification.id}
                    sx={{
                      "&:hover": {
                        bgcolor: "#f9fafb",
                      },
                      cursor: "pointer",
                    }}
                    onClick={() => handleViewNotification(notification.id)}
                  >
                    <TableCell
                      sx={{
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottom: "1px solid #e5e7eb",
                        maxWidth: 500,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: "#333",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {notification.title.toUpperCase()}
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {formatDateTime(notification.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {notification.seenDate
                          ? formatDateTime(notification.seenDate)
                          : ""}
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewNotification(notification.id);
                        }}
                        sx={{
                          color: "#9ca3af",
                          "&:hover": {
                            color: "#B71C1C",
                            bgcolor: "rgba(183, 28, 28, 0.1)",
                          },
                        }}
                      >
                        <ChatBubbleOutlineIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};
