import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  TablePagination,
  Menu,
  MenuItem,
  CircularProgress,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
} from "@mui/material";
import {
  useNotificationsByUser,
  useCreateNotification,
  useDeleteNotification,
  useMarkAsSeen,
} from "../queries/notification.queries";
import { useGetAllUsers } from "../../users/queries/user.queries";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useState, useEffect, useMemo } from "react";
import { NotificationFormDialog } from "../components/NotificationFormDialog";
import { NotificationDeleteDialog } from "../components/NotificationDeleteDialog";
import type { NotificationWithUser } from "../types/notification.types";
import { toast } from "react-toastify";

export const NotificationsPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingNotification, setEditingNotification] =
    useState<NotificationWithUser | null>(null);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationWithUser | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [notificationToDelete, setNotificationToDelete] =
    useState<NotificationWithUser | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: users } = useGetAllUsers();
  const { data: notifications, isLoading } = useNotificationsByUser(
    selectedUserId || ""
  );

  const createNotificationMutation = useCreateNotification();
  const deleteNotificationMutation = useDeleteNotification();
  const markAsSeenMutation = useMarkAsSeen();

  // Combine Notification and User data
  const notificationsWithUsers: NotificationWithUser[] = useMemo(() => {
    if (!notifications || !users || !Array.isArray(notifications) || !Array.isArray(users)) return [];
    return notifications.map((notification) => ({
      ...notification,
      user: users.find((u) => u.id === notification.sendTo),
    }));
  }, [notifications, users]);

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    let filtered = notificationsWithUsers;

    if (debouncedSearch) {
      const search = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(search) ||
          n.content.toLowerCase().includes(search) ||
          n.user?.fullName.toLowerCase().includes(search) ||
          n.user?.email.toLowerCase().includes(search)
      );
    }

    return filtered;
  }, [notificationsWithUsers, debouncedSearch]);

  // Pagination
  const paginatedNotifications = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredNotifications.slice(start, end);
  }, [filteredNotifications, page, rowsPerPage]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddNotification = () => {
    setEditingNotification(null);
    setFormOpen(true);
  };

  const handleEditNotification = (notification: NotificationWithUser) => {
    setEditingNotification(notification);
    setFormOpen(true);
    handleCloseMenu();
  };

  const handleDeleteNotification = (notification: NotificationWithUser) => {
    setNotificationToDelete(notification);
    setDeleteError(null);
    setDeleteDialogOpen(true);
    handleCloseMenu();
  };

  const handleMarkAsSeen = async (notification: NotificationWithUser) => {
    try {
      await markAsSeenMutation.mutateAsync(notification.id);
      toast.success("Đã đánh dấu thông báo là đã xem");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Có lỗi xảy ra";
      toast.error(msg);
    }
  };

  const handleConfirmDelete = async () => {
    if (!notificationToDelete) return;

    try {
      setDeleteError(null);
      await deleteNotificationMutation.mutateAsync(notificationToDelete.id);
      toast.success("Xóa thông báo thành công");
      setDeleteDialogOpen(false);
    } catch (error: any) {
      const msg = error.response?.data?.message || "Xóa thông báo thất bại";
      setDeleteError(msg);
    }
  };

  const handleFormSubmit = async (data: {
    title: string;
    content: string;
    sendTo: string;
  }) => {
    try {
      if (editingNotification) {
        // Update not supported by API, only create
        toast.error("Cập nhật thông báo không được hỗ trợ");
        return;
      } else {
        await createNotificationMutation.mutateAsync(data);
        toast.success("Tạo thông báo thành công");
      }
      setFormOpen(false);
    } catch (error: any) {
      const msg = error.response?.data?.message || "Có lỗi xảy ra";
      toast.error(msg);
    }
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    notification: NotificationWithUser
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedNotification(notification);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedNotification(null);
  };

  const availableUsers = Array.isArray(users) ? users : [];

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, color: "#111827", mb: 1 }}
          >
            Quản lý thông báo
          </Typography>
          <Typography variant="body1" sx={{ color: "#6b7280" }}>
            Quản lý và gửi thông báo cho người dùng trong hệ thống.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddNotification}
          sx={{
            bgcolor: "primary.main",
            boxShadow:
              "0 4px 6px -1px rgba(183, 28, 28, 0.4), 0 2px 4px -1px rgba(183, 28, 28, 0.2)",
            "&:hover": { bgcolor: "primary.dark" },
          }}
        >
          Tạo thông báo
        </Button>
      </Box>

      <Paper
        elevation={0}
        sx={{
          borderRadius: "20px",
          border: "1px solid #f3f4f6",
          overflow: "hidden",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.03)",
          p: 3,
        }}
      >
        <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 250 }}>
            <InputLabel>Người nhận</InputLabel>
            <Select
              value={selectedUserId}
              label="Người nhận"
              onChange={(e) => {
                setSelectedUserId(e.target.value);
                setPage(0);
              }}
              sx={{
                borderRadius: "12px",
                bgcolor: "#f9fafb",
                "& fieldset": { borderColor: "#e5e7eb" },
              }}
            >
              <MenuItem value="">Tất cả người dùng</MenuItem>
              {availableUsers.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.fullName} ({user.email})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            placeholder="Tìm kiếm theo tiêu đề, nội dung..."
            variant="outlined"
            fullWidth
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#9ca3af" }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: "12px",
                bgcolor: "#f9fafb",
                "& fieldset": { borderColor: "#e5e7eb" },
              },
            }}
          />
        </Box>

        {!selectedUserId && (
          <Box sx={{ mb: 2, p: 2, bgcolor: "#fef3c7", borderRadius: 2 }}>
            <Typography variant="body2" color="warning.main">
              Vui lòng chọn người dùng để xem thông báo
            </Typography>
          </Box>
        )}

        <TableContainer className="custom-scrollbar">
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f9fafb" }}>
                <TableCell sx={{ fontWeight: 600, color: "#4b5563" }}>
                  Tiêu đề
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#4b5563" }}>
                  Nội dung
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#4b5563" }}>
                  Người nhận
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#4b5563" }}>
                  Trạng thái
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#4b5563" }}>
                  Ngày tạo
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 600, color: "#4b5563" }}
                  align="right"
                >
                  Hành động
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <CircularProgress size={30} />
                  </TableCell>
                </TableRow>
              ) : !selectedUserId ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography color="text.secondary">
                      Vui lòng chọn người dùng để xem thông báo
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedNotifications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography color="text.secondary">
                      Không tìm thấy thông báo nào
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedNotifications.map((notification) => (
                  <TableRow key={notification.id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {notification.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          maxWidth: 300,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {notification.content}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {notification.user ? (
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {notification.user.fullName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {notification.user.email}
                          </Typography>
                        </Box>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {notification.seenDate ? (
                        <Chip
                          label="Đã xem"
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      ) : (
                        <Chip
                          label="Chưa xem"
                          size="small"
                          color="warning"
                          variant="outlined"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">
                        {new Date(notification.createdAt).toLocaleString("vi-VN")}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
                        {!notification.seenDate && (
                          <Tooltip title="Đánh dấu đã xem">
                            <IconButton
                              size="small"
                              onClick={() => handleMarkAsSeen(notification)}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuClick(e, notification)}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {selectedUserId && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredNotifications.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Số hàng mỗi trang:"
          />
        )}
      </Paper>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem
          onClick={() =>
            selectedNotification && handleDeleteNotification(selectedNotification)
          }
          sx={{ color: "error.main" }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Xóa
        </MenuItem>
      </Menu>

      <NotificationFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingNotification}
        isLoading={createNotificationMutation.isPending}
      />

      <NotificationDeleteDialog
        open={deleteDialogOpen}
        notification={notificationToDelete}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteNotificationMutation.isPending}
        error={deleteError}
      />
    </Box>
  );
};

