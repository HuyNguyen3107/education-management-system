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
  IconButton,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Chip,
} from "@mui/material";
import {
  useStudentMajors,
  useCreateStudentMajor,
  useUpdateStudentMajor,
  useDeleteStudentMajor,
} from "../queries/student-major.queries";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useEffect, useMemo } from "react";
import { StudentMajorFormDialog } from "../components/StudentMajorFormDialog";
import { StudentMajorDeleteDialog } from "../components/StudentMajorDeleteDialog";
import type {
  StudentMajor,
  CreateStudentMajorRequest,
} from "../types/student-major.types";
import { toast } from "react-toastify";
import { usePageMeta } from "@/hooks/usePageMeta";
import { getErrorMessage } from "@/libs/toast.libs";

export const StudentMajorsPage = () => {
  usePageMeta("Gán ngành và chuyên ngành cho sinh viên");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingStudentMajor, setEditingStudentMajor] =
    useState<StudentMajor | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentMajorToDelete, setStudentMajorToDelete] =
    useState<StudentMajor | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: studentMajorsData, isLoading, isError } = useStudentMajors();

  const createStudentMajorMutation = useCreateStudentMajor();
  const updateStudentMajorMutation = useUpdateStudentMajor();
  const deleteStudentMajorMutation = useDeleteStudentMajor();

  // Filter student majors
  const filteredStudentMajors = useMemo(() => {
    let result = studentMajorsData || [];

    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      result = result.filter(
        (sm) =>
          sm.studentCode?.toLowerCase().includes(searchLower) ||
          sm.studentName?.toLowerCase().includes(searchLower) ||
          sm.majorName?.toLowerCase().includes(searchLower) ||
          sm.specializationName?.toLowerCase().includes(searchLower)
      );
    }

    return result;
  }, [studentMajorsData, debouncedSearch]);

  const handleAddStudentMajor = () => {
    setEditingStudentMajor(null);
    setFormOpen(true);
  };

  const handleEditStudentMajor = (sm: StudentMajor) => {
    setEditingStudentMajor(sm);
    setFormOpen(true);
  };

  const handleDeleteClick = (sm: StudentMajor) => {
    setStudentMajorToDelete(sm);
    setDeleteError(null);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = (data: CreateStudentMajorRequest) => {
    if (editingStudentMajor) {
      updateStudentMajorMutation.mutate(
        { id: editingStudentMajor.id, data },
        {
          onSuccess: () => {
            toast.success("Cập nhật ngành/chuyên ngành thành công");
            setFormOpen(false);
          },
          onError: (error: any) => {
            const msg = getErrorMessage(
              error,
              "Có lỗi xảy ra khi cập nhật ngành/chuyên ngành."
            );
            toast.error(msg);
          },
        }
      );
    } else {
      createStudentMajorMutation.mutate(data, {
        onSuccess: () => {
          toast.success("Gán ngành/chuyên ngành thành công");
          setFormOpen(false);
        },
        onError: (error: any) => {
          const msg = getErrorMessage(
            error,
            "Có lỗi xảy ra khi gán ngành/chuyên ngành."
          );
          toast.error(msg);
        },
      });
    }
  };

  const handleConfirmDelete = () => {
    if (studentMajorToDelete) {
      setDeleteError(null);
      deleteStudentMajorMutation.mutate(studentMajorToDelete.id, {
        onSuccess: () => {
          toast.success("Xóa gán ngành/chuyên ngành thành công");
          setDeleteDialogOpen(false);
          setStudentMajorToDelete(null);
        },
        onError: (error: any) => {
          const msg = getErrorMessage(
            error,
            "Có lỗi xảy ra khi xóa gán ngành/chuyên ngành."
          );
          setDeleteError(msg);
        },
      });
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
            Gán ngành và chuyên ngành cho sinh viên
          </Typography>
          <Typography variant="body1" sx={{ color: "#6b7280" }}>
            Quản lý việc gán ngành học và chuyên ngành cho sinh viên trong hệ
            thống.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddStudentMajor}
          sx={{
            bgcolor: "primary.main",
            boxShadow:
              "0 4px 6px -1px rgba(183, 28, 28, 0.4), 0 2px 4px -1px rgba(183, 28, 28, 0.2)",
            "&:hover": { bgcolor: "primary.dark" },
          }}
        >
          Gán mới
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
        <Box sx={{ mb: 3 }}>
          <TextField
            placeholder="Tìm kiếm theo mã SV, tên, ngành hoặc chuyên ngành..."
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

        <TableContainer className="custom-scrollbar">
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f9fafb" }}>
                <TableCell sx={{ fontWeight: 600, color: "#4b5563" }}>
                  Mã sinh viên
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#4b5563" }}>
                  Tên sinh viên
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#4b5563" }}>
                  Ngành
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#4b5563" }}>
                  Chuyên ngành
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#4b5563" }}>
                  Ngày gán
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
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography color="error">
                      Có lỗi xảy ra khi tải dữ liệu
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : filteredStudentMajors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography color="text.secondary">
                      Không tìm thấy dữ liệu nào
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudentMajors.map((sm) => (
                  <TableRow key={sm.id} hover>
                    <TableCell>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 600, color: "primary.main" }}
                      >
                        {sm.studentCode || "-"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {sm.studentName || "-"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={sm.majorName || "-"}
                        color="primary"
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {sm.specializationName ? (
                        <Chip
                          label={sm.specializationName}
                          color="secondary"
                          size="small"
                          variant="outlined"
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Chưa có
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(sm.createdAt).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEditStudentMajor(sm)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(sm)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <StudentMajorFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingStudentMajor}
        isLoading={
          createStudentMajorMutation.isPending ||
          updateStudentMajorMutation.isPending
        }
      />

      <StudentMajorDeleteDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setDeleteError(null);
        }}
        onConfirm={handleConfirmDelete}
        studentMajor={studentMajorToDelete}
        isLoading={deleteStudentMajorMutation.isPending}
        error={deleteError}
      />
    </Box>
  );
};
