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
  useLecturers,
  useCreateLecturer,
  useUpdateLecturer,
  useDeleteLecturer,
} from "../queries/lecturer.queries";
import { useGetAllUsers } from "../../users/queries/user.queries";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState, useEffect, useMemo } from "react";
import { LecturerFormDialog } from "../components/LecturerFormDialog";
import { LecturerDeleteDialog } from "../components/LecturerDeleteDialog";
import type { Lecturer } from "../types/lecturer.types";
import type { User } from "../../users/types/user.types";
import { toast } from "react-toastify";
import {
  USER_STATUS,
  getStatusColor,
  getStatusLabel,
} from "../../users/constants/user-status.constants";

interface LecturerWithUserData extends Lecturer {
  user?: User;
}

export const LecturersPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingLecturer, setEditingLecturer] =
    useState<LecturerWithUserData | null>(null);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedLecturer, setSelectedLecturer] =
    useState<LecturerWithUserData | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [lecturerToDelete, setLecturerToDelete] =
    useState<LecturerWithUserData | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: lecturers, isLoading: lecturersLoading } = useLecturers();
  const { data: users, isLoading: usersLoading } = useGetAllUsers();

  const createLecturerMutation = useCreateLecturer();
  const updateLecturerMutation = useUpdateLecturer();
  const deleteLecturerMutation = useDeleteLecturer();

  // Combine Lecturer and User data
  const lecturersWithUsers: LecturerWithUserData[] = useMemo(() => {
    if (
      !lecturers ||
      !users ||
      !Array.isArray(lecturers) ||
      !Array.isArray(users)
    )
      return [];
    return lecturers.map((lecturer) => ({
      ...lecturer,
      user: users.find((u) => u.id === lecturer.userId),
    }));
  }, [lecturers, users]);

  // Filter lecturers
  const filteredLecturers = useMemo(() => {
    let filtered = lecturersWithUsers;

    if (debouncedSearch) {
      const search = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (l) =>
          l.teacherCode.toLowerCase().includes(search) ||
          l.user?.fullName.toLowerCase().includes(search) ||
          l.user?.email.toLowerCase().includes(search)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((l) => l.user?.status === statusFilter);
    }

    return filtered;
  }, [lecturersWithUsers, debouncedSearch, statusFilter]);

  // Pagination
  const paginatedLecturers = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredLecturers.slice(start, end);
  }, [filteredLecturers, page, rowsPerPage]);

  const isLoading = lecturersLoading || usersLoading;

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddLecturer = () => {
    setEditingLecturer(null);
    setFormOpen(true);
  };

  const handleEditLecturer = (lecturer: LecturerWithUserData) => {
    setEditingLecturer(lecturer);
    setFormOpen(true);
    handleCloseMenu();
  };

  const handleDeleteLecturer = (lecturer: LecturerWithUserData) => {
    setLecturerToDelete(lecturer);
    setDeleteError(null);
    setDeleteDialogOpen(true);
    handleCloseMenu();
  };

  const handleConfirmDelete = async () => {
    if (!lecturerToDelete) return;

    try {
      setDeleteError(null);
      await deleteLecturerMutation.mutateAsync(lecturerToDelete.id);
      toast.success("Xóa giảng viên thành công");
      setDeleteDialogOpen(false);
    } catch (error: any) {
      const msg = error.response?.data?.message || "Xóa giảng viên thất bại";
      setDeleteError(msg);
    }
  };

  const handleFormSubmit = async (data: {
    teacherCode: string;
    userId: string;
  }) => {
    try {
      if (editingLecturer) {
        await updateLecturerMutation.mutateAsync({
          id: editingLecturer.id,
          data,
        });
        toast.success("Cập nhật giảng viên thành công");
      } else {
        await createLecturerMutation.mutateAsync(data);
        toast.success("Thêm mới giảng viên thành công");
      }
      setFormOpen(false);
    } catch (error: any) {
      const msg = error.response?.data?.message || "Có lỗi xảy ra";
      toast.error(msg);
    }
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    lecturer: LecturerWithUserData
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedLecturer(lecturer);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedLecturer(null);
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
            Quản lý giảng viên
          </Typography>
          <Typography variant="body1" sx={{ color: "#6b7280" }}>
            Quản lý thông tin giảng viên và mã giảng viên trong hệ thống.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddLecturer}
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
        <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
          <TextField
            placeholder="Tìm kiếm theo mã GV, tên hoặc email..."
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
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={statusFilter}
              label="Trạng thái"
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(0);
              }}
              sx={{
                borderRadius: "12px",
                bgcolor: "#f9fafb",
                "& fieldset": { borderColor: "#e5e7eb" },
              }}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {USER_STATUS.LECTURER.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
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
                  Mã giảng viên
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#4b5563" }}>
                  Họ và tên
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#4b5563" }}>
                  Email
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#4b5563" }}>
                  Số điện thoại
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#4b5563" }}>
                  Giới tính
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#4b5563" }}>
                  Trạng thái
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
              ) : paginatedLecturers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography color="text.secondary">
                      Không tìm thấy giảng viên nào
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedLecturers.map((lecturer) => (
                  <TableRow key={lecturer.id} hover>
                    <TableCell>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 600, color: "primary.main" }}
                      >
                        {lecturer.teacherCode}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {lecturer.user?.fullName || "-"}
                      </Typography>
                    </TableCell>
                    <TableCell>{lecturer.user?.email || "-"}</TableCell>
                    <TableCell>{lecturer.user?.phone || "-"}</TableCell>
                    <TableCell>{lecturer.user?.gender || "-"}</TableCell>
                    <TableCell>
                      {lecturer.user?.status ? (
                        <Chip
                          label={getStatusLabel(lecturer.user.status)}
                          size="small"
                          color={getStatusColor(lecturer.user.status) as any}
                          variant="outlined"
                        />
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, lecturer)}
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
          count={filteredLecturers.length}
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
            selectedLecturer && handleEditLecturer(selectedLecturer)
          }
        >
          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Chỉnh sửa
        </MenuItem>
        <MenuItem
          onClick={() =>
            selectedLecturer && handleDeleteLecturer(selectedLecturer)
          }
          sx={{ color: "error.main" }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Xóa
        </MenuItem>
      </Menu>

      <LecturerFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingLecturer}
        isLoading={
          createLecturerMutation.isPending || updateLecturerMutation.isPending
        }
      />

      <LecturerDeleteDialog
        open={deleteDialogOpen}
        lecturer={lecturerToDelete}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteLecturerMutation.isPending}
        error={deleteError}
      />
    </Box>
  );
};
