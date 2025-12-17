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
} from "@mui/material";
import {
  useTimeRegisters,
  useCreateTimeRegister,
  useUpdateTimeRegister,
  useDeleteTimeRegister,
} from "../queries/time-register.queries";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useState, useEffect, useMemo } from "react";
import { TimeRegisterFormDialog } from "../components/TimeRegisterFormDialog";
import { TimeRegisterDeleteDialog } from "../components/TimeRegisterDeleteDialog";
import type { TimeRegister } from "../types/time-register.types";
import { toast } from "react-toastify";
import { usePageMeta } from "@/hooks/usePageMeta";

export const TimeRegistersPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeSemesterFilter, setTypeSemesterFilter] = useState("");
  const [typeRegisterFilter, setTypeRegisterFilter] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingTimeRegister, setEditingTimeRegister] =
    useState<TimeRegister | null>(null);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTimeRegister, setSelectedTimeRegister] =
    useState<TimeRegister | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [timeRegisterToDelete, setTimeRegisterToDelete] =
    useState<TimeRegister | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  usePageMeta(
    "Quản lý thời gian đăng ký",
    "Cấu hình và quản lý các khoảng thời gian mở và đóng đăng ký học phần."
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: timeRegisters, isLoading } = useTimeRegisters();

  const createTimeRegisterMutation = useCreateTimeRegister();
  const updateTimeRegisterMutation = useUpdateTimeRegister();
  const deleteTimeRegisterMutation = useDeleteTimeRegister();

  // Get unique values for filters
  const uniqueTypeSemesters = useMemo(() => {
    if (!timeRegisters || !Array.isArray(timeRegisters)) return [];
    return Array.from(
      new Set(
        timeRegisters
          .map((tr) => tr.typeSemester)
          .filter((v): v is string => v !== null && v !== undefined)
      )
    ).sort();
  }, [timeRegisters]);

  const uniqueTypeRegisters = useMemo(() => {
    if (!timeRegisters || !Array.isArray(timeRegisters)) return [];
    return Array.from(
      new Set(
        timeRegisters
          .map((tr) => tr.typeRegister)
          .filter((v): v is string => v !== null && v !== undefined)
      )
    ).sort();
  }, [timeRegisters]);

  // Filter time registers
  const filteredTimeRegisters = useMemo(() => {
    if (!timeRegisters || !Array.isArray(timeRegisters)) return [];
    let filtered = timeRegisters;

    if (debouncedSearch) {
      const search = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (tr) =>
          tr.typeSemester?.toLowerCase().includes(search) ||
          tr.typeRegister?.toLowerCase().includes(search) ||
          tr.openTime.toLowerCase().includes(search) ||
          tr.endTime.toLowerCase().includes(search)
      );
    }

    if (typeSemesterFilter) {
      filtered = filtered.filter((tr) => tr.typeSemester === typeSemesterFilter);
    }

    if (typeRegisterFilter) {
      filtered = filtered.filter(
        (tr) => tr.typeRegister === typeRegisterFilter
      );
    }

    // Sort by createdAt desc
    return filtered.sort((a, b) => {
      return (
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });
  }, [timeRegisters, debouncedSearch, typeSemesterFilter, typeRegisterFilter]);

  // Pagination
  const paginatedTimeRegisters = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredTimeRegisters.slice(start, end);
  }, [filteredTimeRegisters, page, rowsPerPage]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddTimeRegister = () => {
    setEditingTimeRegister(null);
    setFormOpen(true);
  };

  const handleEditTimeRegister = (timeRegister: TimeRegister) => {
    setEditingTimeRegister(timeRegister);
    setFormOpen(true);
    handleCloseMenu();
  };

  const handleDeleteTimeRegister = (timeRegister: TimeRegister) => {
    setTimeRegisterToDelete(timeRegister);
    setDeleteError(null);
    setDeleteDialogOpen(true);
    handleCloseMenu();
  };

  const handleConfirmDelete = async () => {
    if (!timeRegisterToDelete) return;

    try {
      setDeleteError(null);
      await deleteTimeRegisterMutation.mutateAsync(timeRegisterToDelete.id);
      toast.success("Xóa thời gian đăng ký thành công");
      setDeleteDialogOpen(false);
    } catch (error: any) {
      const msg =
        error.response?.data?.message || "Xóa thời gian đăng ký thất bại";
      setDeleteError(msg);
    }
  };

  const handleFormSubmit = async (data: {
    typeSemester?: string;
    typeRegister?: string;
    openTime: string;
    endTime: string;
  }) => {
    try {
      if (editingTimeRegister) {
        await updateTimeRegisterMutation.mutateAsync({
          id: editingTimeRegister.id,
          data,
        });
        toast.success("Cập nhật thời gian đăng ký thành công");
      } else {
        await createTimeRegisterMutation.mutateAsync(data);
        toast.success("Thêm mới thời gian đăng ký thành công");
      }
      setFormOpen(false);
    } catch (error: any) {
      const msg = error.response?.data?.message || "Có lỗi xảy ra";
      toast.error(msg);
    }
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    timeRegister: TimeRegister
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedTimeRegister(timeRegister);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedTimeRegister(null);
  };

  const formatDateTime = (dateTimeString: string) => {
    try {
      return new Date(dateTimeString).toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateTimeString;
    }
  };

  const getStatusChip = (openTime: string, endTime: string) => {
    const now = new Date();
    const open = new Date(openTime);
    const end = new Date(endTime);

    if (now < open) {
      return <Chip label="Chưa mở" size="small" color="default" variant="outlined" />;
    } else if (now >= open && now <= end) {
      return <Chip label="Đang mở" size="small" color="success" variant="outlined" />;
    } else {
      return <Chip label="Đã đóng" size="small" color="error" variant="outlined" />;
    }
  };

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
            Quản lý thời gian đăng ký
          </Typography>
          <Typography variant="body1" sx={{ color: "#6b7280" }}>
            Quản lý thời gian mở và đóng đăng ký học phần theo học kỳ.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddTimeRegister}
          sx={{
            bgcolor: "primary.main",
            boxShadow:
              "0 4px 6px -1px rgba(183, 28, 28, 0.4), 0 2px 4px -1px rgba(183, 28, 28, 0.2)",
            "&:hover": { bgcolor: "primary.dark" },
          }}
        >
          Thêm mới
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
        <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            placeholder="Tìm kiếm theo loại học kỳ, loại đăng ký..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flex: 1, minWidth: 250 }}
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
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Loại học kỳ</InputLabel>
            <Select
              value={typeSemesterFilter}
              label="Loại học kỳ"
              onChange={(e) => {
                setTypeSemesterFilter(e.target.value);
                setPage(0);
              }}
              sx={{
                borderRadius: "12px",
                bgcolor: "#f9fafb",
                "& fieldset": { borderColor: "#e5e7eb" },
              }}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {uniqueTypeSemesters.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Loại đăng ký</InputLabel>
            <Select
              value={typeRegisterFilter}
              label="Loại đăng ký"
              onChange={(e) => {
                setTypeRegisterFilter(e.target.value);
                setPage(0);
              }}
              sx={{
                borderRadius: "12px",
                bgcolor: "#f9fafb",
                "& fieldset": { borderColor: "#e5e7eb" },
              }}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {uniqueTypeRegisters.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <TableContainer className="custom-scrollbar">
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f9fafb" }}>
                <TableCell sx={{ fontWeight: 600, color: "#4b5563" }}>
                  Loại học kỳ
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#4b5563" }}>
                  Loại đăng ký
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#4b5563" }}>
                  Thời gian mở
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#4b5563" }}>
                  Thời gian đóng
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
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <CircularProgress size={30} />
                  </TableCell>
                </TableRow>
              ) : paginatedTimeRegisters.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography color="text.secondary">
                      Không tìm thấy thời gian đăng ký nào
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedTimeRegisters.map((timeRegister) => (
                  <TableRow key={timeRegister.id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {timeRegister.typeSemester || "-"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {timeRegister.typeRegister || "-"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <AccessTimeIcon sx={{ fontSize: 16, color: "primary.main" }} />
                        <Typography variant="body2">
                          {formatDateTime(timeRegister.openTime)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <AccessTimeIcon sx={{ fontSize: 16, color: "error.main" }} />
                        <Typography variant="body2">
                          {formatDateTime(timeRegister.endTime)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {getStatusChip(timeRegister.openTime, timeRegister.endTime)}
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">
                        {formatDateTime(timeRegister.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, timeRegister)}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredTimeRegisters.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số hàng mỗi trang:"
        />
      </Paper>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem
          onClick={() =>
            selectedTimeRegister && handleEditTimeRegister(selectedTimeRegister)
          }
        >
          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Chỉnh sửa
        </MenuItem>
        <MenuItem
          onClick={() =>
            selectedTimeRegister && handleDeleteTimeRegister(selectedTimeRegister)
          }
          sx={{ color: "error.main" }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Xóa
        </MenuItem>
      </Menu>

      <TimeRegisterFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingTimeRegister}
        isLoading={
          createTimeRegisterMutation.isPending ||
          updateTimeRegisterMutation.isPending
        }
      />

      <TimeRegisterDeleteDialog
        open={deleteDialogOpen}
        timeRegister={timeRegisterToDelete}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteTimeRegisterMutation.isPending}
        error={deleteError}
      />
    </Box>
  );
};

