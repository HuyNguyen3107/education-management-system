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
  useStudents,
  useCreateStudent,
  useUpdateStudent,
  useDeleteStudent,
} from "../queries/student.queries";
import { useGetAllUsers } from "../../users/queries/user.queries";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState, useEffect, useMemo } from "react";
import { StudentFormDialog } from "../components/StudentFormDialog";
import { StudentDeleteDialog } from "../components/StudentDeleteDialog";
import type { Student } from "../types/student.types";
import type { User } from "../../users/types/user.types";
import { toast } from "react-toastify";
import {
  USER_STATUS,
  getStatusColor,
  getStatusLabel,
} from "../../users/constants/user-status.constants";
import { usePageMeta } from "@/hooks/usePageMeta";

interface StudentWithUserData extends Student {
  user?: User;
}

export const StudentsPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentWithUserData | null>(null);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentWithUserData | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<StudentWithUserData | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  usePageMeta(
    "Quản lý sinh viên",
    "Quản lý thông tin sinh viên và mã sinh viên trong hệ thống."
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: students, isLoading: studentsLoading } = useStudents();
  const { data: users, isLoading: usersLoading } = useGetAllUsers();

  const createStudentMutation = useCreateStudent();
  const updateStudentMutation = useUpdateStudent();
  const deleteStudentMutation = useDeleteStudent();

  // Combine Student and User data
  const studentsWithUsers: StudentWithUserData[] = useMemo(() => {
    if (!students || !users || !Array.isArray(students) || !Array.isArray(users)) return [];
    return students.map((student) => ({
      ...student,
      user: users.find((u) => u.id === student.userId),
    }));
  }, [students, users]);

  // Filter students
  const filteredStudents = useMemo(() => {
    let filtered = studentsWithUsers;

    if (debouncedSearch) {
      const search = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.studentCode.toLowerCase().includes(search) ||
          s.user?.fullName.toLowerCase().includes(search) ||
          s.user?.email.toLowerCase().includes(search)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((s) => s.user?.status === statusFilter);
    }

    return filtered;
  }, [studentsWithUsers, debouncedSearch, statusFilter]);

  // Pagination
  const paginatedStudents = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredStudents.slice(start, end);
  }, [filteredStudents, page, rowsPerPage]);

  const isLoading = studentsLoading || usersLoading;

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddStudent = () => {
    setEditingStudent(null);
    setFormOpen(true);
  };

  const handleEditStudent = (student: StudentWithUserData) => {
    setEditingStudent(student);
    setFormOpen(true);
    handleCloseMenu();
  };

  const handleDeleteStudent = (student: StudentWithUserData) => {
    setStudentToDelete(student);
    setDeleteError(null);
    setDeleteDialogOpen(true);
    handleCloseMenu();
  };

  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;

    try {
      setDeleteError(null);
      await deleteStudentMutation.mutateAsync(studentToDelete.id);
      toast.success("Xóa sinh viên thành công");
      setDeleteDialogOpen(false);
    } catch (error: any) {
      const msg = error.response?.data?.message || "Xóa sinh viên thất bại";
      setDeleteError(msg);
    }
  };

  const handleFormSubmit = async (data: { studentCode: string; userId: string }) => {
    try {
      if (editingStudent) {
        await updateStudentMutation.mutateAsync({ id: editingStudent.id, data });
        toast.success("Cập nhật sinh viên thành công");
      } else {
        await createStudentMutation.mutateAsync(data);
        toast.success("Thêm mới sinh viên thành công");
      }
      setFormOpen(false);
    } catch (error: any) {
      const msg = error.response?.data?.message || "Có lỗi xảy ra";
      toast.error(msg);
    }
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    student: StudentWithUserData
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedStudent(student);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedStudent(null);
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
            Quản lý sinh viên
          </Typography>
          <Typography variant="body1" sx={{ color: "#6b7280" }}>
            Quản lý thông tin sinh viên và mã sinh viên trong hệ thống.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddStudent}
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
            placeholder="Tìm kiếm theo mã SV, tên hoặc email..."
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
              {USER_STATUS.STUDENT.map((status) => (
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
                  Mã sinh viên
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
                  Niên khóa
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
              ) : paginatedStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography color="text.secondary">
                      Không tìm thấy sinh viên nào
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedStudents.map((student) => (
                  <TableRow key={student.id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "primary.main" }}>
                        {student.studentCode}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {student.user?.fullName || "-"}
                      </Typography>
                    </TableCell>
                    <TableCell>{student.user?.email || "-"}</TableCell>
                    <TableCell>{student.user?.phone || "-"}</TableCell>
                    <TableCell>{student.user?.academicYear || "-"}</TableCell>
                    <TableCell>
                      {student.user?.status ? (
                        <Chip
                          label={getStatusLabel(student.user.status)}
                          size="small"
                          color={getStatusColor(student.user.status) as any}
                          variant="outlined"
                        />
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, student)}
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
          count={filteredStudents.length}
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
        <MenuItem onClick={() => selectedStudent && handleEditStudent(selectedStudent)}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Chỉnh sửa
        </MenuItem>
        <MenuItem
          onClick={() => selectedStudent && handleDeleteStudent(selectedStudent)}
          sx={{ color: "error.main" }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Xóa
        </MenuItem>
      </Menu>

      <StudentFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingStudent}
        isLoading={createStudentMutation.isPending || updateStudentMutation.isPending}
      />

      <StudentDeleteDialog
        open={deleteDialogOpen}
        student={studentToDelete}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteStudentMutation.isPending}
        error={deleteError}
      />
    </Box>
  );
};
