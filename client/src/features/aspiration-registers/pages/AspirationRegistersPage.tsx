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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Tooltip,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import {
  useAspirationRegisters,
  useCreateAspirationRegister,
  useUpdateAspirationRegister,
  useDeleteAspirationRegister,
} from "../queries/aspiration-register.queries";
import { useStudents } from "../../students/queries/student.queries";
import { useSubjects } from "../../subjects/queries/subject.queries";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useState, useEffect, useMemo } from "react";
import { AspirationRegisterFormDialog } from "../components/AspirationRegisterFormDialog";
import { AspirationRegisterDeleteDialog } from "../components/AspirationRegisterDeleteDialog";
import { AspirationRegisterDetailDialog } from "../components/AspirationRegisterDetailDialog";
import type { AspirationRegister, CreateAspirationRegisterRequest } from "../types/aspiration-register.types";
import { toast } from "react-toastify";
import { usePageMeta } from "@/hooks/usePageMeta";

// Helper function to strip HTML tags for preview
const stripHtml = (html: string) => {
  if (!html) return "";
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

export const AspirationRegistersPage = () => {
  usePageMeta("Quản lý nguyện vọng đăng ký");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingAspirationRegister, setEditingAspirationRegister] = useState<AspirationRegister | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [aspirationRegisterToDelete, setAspirationRegisterToDelete] = useState<AspirationRegister | null>(null);

  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedDetailData, setSelectedDetailData] = useState<AspirationRegister | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: aspirationRegistersData, isLoading, isError } = useAspirationRegisters();
  const { data: students = [] } = useStudents();
  const { data: subjects = [] } = useSubjects();

  const createAspirationRegisterMutation = useCreateAspirationRegister();
  const updateAspirationRegisterMutation = useUpdateAspirationRegister();
  const deleteAspirationRegisterMutation = useDeleteAspirationRegister();

  // Create lookup maps
  const studentMap = useMemo(() => {
    return students.reduce((acc, student) => {
      acc[student.id] = student.studentCode;
      return acc;
    }, {} as Record<string, string>);
  }, [students]);

  const subjectMap = useMemo(() => {
    return subjects.reduce((acc, subject) => {
      acc[subject.subjectCode] = subject.name;
      return acc;
    }, {} as Record<string, string>);
  }, [subjects]);

  // Get unique semesters for filter
  const semesters = useMemo(() => {
    const semesterSet = new Set<string>();
    aspirationRegistersData?.forEach((ar) => {
      if (ar.semester) semesterSet.add(ar.semester);
    });
    return Array.from(semesterSet).sort();
  }, [aspirationRegistersData]);

  // Filter aspiration registers
  const filteredAspirationRegisters = useMemo(() => {
    let result = aspirationRegistersData || [];

    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      result = result.filter(
        (ar) =>
          ar.subjectCode.toLowerCase().includes(searchLower) ||
          subjectMap[ar.subjectCode]?.toLowerCase().includes(searchLower) ||
          studentMap[ar.studentId]?.toLowerCase().includes(searchLower) ||
          stripHtml(ar.reason || "").toLowerCase().includes(searchLower)
      );
    }

    if (selectedSemester) {
      result = result.filter((ar) => ar.semester === selectedSemester);
    }

    if (selectedStudentId) {
      result = result.filter((ar) => ar.studentId === selectedStudentId);
    }

    return result;
  }, [aspirationRegistersData, debouncedSearch, selectedSemester, selectedStudentId, studentMap, subjectMap]);

  const handleSemesterFilterChange = (event: SelectChangeEvent) => {
    setSelectedSemester(event.target.value);
  };

  const handleStudentFilterChange = (event: SelectChangeEvent) => {
    setSelectedStudentId(event.target.value);
  };

  const handleAddAspirationRegister = () => {
    setEditingAspirationRegister(null);
    setFormOpen(true);
  };

  const handleEditAspirationRegister = (ar: AspirationRegister) => {
    setEditingAspirationRegister(ar);
    setFormOpen(true);
  };

  const handleDeleteClick = (ar: AspirationRegister) => {
    setAspirationRegisterToDelete(ar);
    setDeleteDialogOpen(true);
  };

  const handleViewDetail = (ar: AspirationRegister) => {
    setSelectedDetailData(ar);
    setDetailDialogOpen(true);
  };

  const handleFormSubmit = (data: CreateAspirationRegisterRequest) => {
    if (editingAspirationRegister) {
      updateAspirationRegisterMutation.mutate(
        { id: editingAspirationRegister.id, data },
        {
          onSuccess: () => {
            toast.success("Cập nhật nguyện vọng thành công");
            setFormOpen(false);
          },
          onError: (error: any) => {
            toast.error(error.response?.data?.message || "Có lỗi xảy ra");
          },
        }
      );
    } else {
      createAspirationRegisterMutation.mutate(data, {
        onSuccess: () => {
          toast.success("Thêm nguyện vọng thành công");
          setFormOpen(false);
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Có lỗi xảy ra");
        },
      });
    }
  };

  const handleConfirmDelete = () => {
    if (aspirationRegisterToDelete) {
      deleteAspirationRegisterMutation.mutate(aspirationRegisterToDelete.id, {
        onSuccess: () => {
          toast.success("Xóa nguyện vọng thành công");
          setDeleteDialogOpen(false);
          setAspirationRegisterToDelete(null);
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Có lỗi xảy ra");
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
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Danh sách nguyện vọng đăng ký
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddAspirationRegister}
        >
          Thêm mới
        </Button>
      </Box>

      <Paper sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            placeholder="Tìm kiếm nguyện vọng..."
            variant="outlined"
            size="small"
            sx={{ flex: 1, minWidth: 200 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Lọc theo sinh viên</InputLabel>
            <Select
              value={selectedStudentId}
              label="Lọc theo sinh viên"
              onChange={handleStudentFilterChange}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {students.map((student) => (
                <MenuItem key={student.id} value={student.id}>
                  {student.studentCode}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Lọc theo học kỳ</InputLabel>
            <Select
              value={selectedSemester}
              label="Lọc theo học kỳ"
              onChange={handleSemesterFilterChange}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {semesters.map((semester) => (
                <MenuItem key={semester} value={semester}>
                  {semester}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <Paper>
        <TableContainer className="custom-scrollbar">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sinh viên</TableCell>
                <TableCell>Mã môn học</TableCell>
                <TableCell>Tên môn học</TableCell>
                <TableCell>Lý do</TableCell>
                <TableCell>Học kỳ</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell align="right">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography color="error">
                      Có lỗi xảy ra khi tải dữ liệu
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : filteredAspirationRegisters.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Chưa có dữ liệu
                  </TableCell>
                </TableRow>
              ) : (
                filteredAspirationRegisters.map((ar) => (
                  <TableRow key={ar.id}>
                    <TableCell>
                      <Chip
                        label={studentMap[ar.studentId] || ar.studentId}
                        color="default"
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={ar.subjectCode}
                        color="primary"
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={500}>
                        {subjectMap[ar.subjectCode] || "-"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Xem chi tiết để xem đầy đủ">
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 250,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            cursor: "pointer",
                          }}
                          onClick={() => handleViewDetail(ar)}
                        >
                          {stripHtml(ar.reason || "") || "-"}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={ar.semester}
                        color="secondary"
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(ar.createdAt).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Xem chi tiết">
                        <IconButton
                          color="info"
                          onClick={() => handleViewDetail(ar)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Chỉnh sửa">
                        <IconButton
                          color="primary"
                          onClick={() => handleEditAspirationRegister(ar)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteClick(ar)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <AspirationRegisterFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingAspirationRegister}
        isLoading={
          createAspirationRegisterMutation.isPending ||
          updateAspirationRegisterMutation.isPending
        }
      />

      <AspirationRegisterDeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteAspirationRegisterMutation.isPending}
      />

      <AspirationRegisterDetailDialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        data={selectedDetailData}
        studentCode={selectedDetailData ? studentMap[selectedDetailData.studentId] : undefined}
        subjectName={selectedDetailData ? subjectMap[selectedDetailData.subjectCode] : undefined}
      />
    </Box>
  );
};
