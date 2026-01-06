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
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import {
  useStudentTuitions,
  useCreateStudentTuition,
  useUpdateStudentTuition,
  useDeleteStudentTuition,
} from "../queries/student-tuition.queries";
import { useStudents } from "../../students/queries/student.queries";
import { useTuitions } from "../../tuitions/queries/tuition.queries";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useEffect, useMemo } from "react";
import { StudentTuitionFormDialog } from "../components/StudentTuitionFormDialog";
import { StudentTuitionDeleteDialog } from "../components/StudentTuitionDeleteDialog";
import type {
  StudentTuition,
  CreateStudentTuitionRequest,
} from "../types/student-tuition.types";
import { toast } from "react-toastify";
import { usePageMeta } from "@/hooks/usePageMeta";
import { TuitionCalculationDialog } from "../../tuition-calculation/components/TuitionCalculationDialog";
import { tuitionCalculationService } from "../../tuition-calculation/services/tuition-calculation.services";
import type { TuitionCalculation } from "../../tuition-calculation/types/tuition-calculation.types";
import CalculateIcon from "@mui/icons-material/Calculate";

export const StudentTuitionsPage = () => {
  usePageMeta("Quản lý học phí sinh viên");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [selectedTuitionId, setSelectedTuitionId] = useState<string>("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingStudentTuition, setEditingStudentTuition] =
    useState<StudentTuition | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentTuitionToDelete, setStudentTuitionToDelete] =
    useState<StudentTuition | null>(null);

  // Tuition calculation dialog state
  const [calculationDialogOpen, setCalculationDialogOpen] = useState(false);
  const [calculationData, setCalculationData] =
    useState<TuitionCalculation | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data: studentTuitionsData,
    isLoading,
    isError,
  } = useStudentTuitions();
  const { data: students = [] } = useStudents();
  const { data: tuitions = [] } = useTuitions();

  const createStudentTuitionMutation = useCreateStudentTuition();
  const updateStudentTuitionMutation = useUpdateStudentTuition();
  const deleteStudentTuitionMutation = useDeleteStudentTuition();

  // Create lookup maps
  const studentMap = useMemo(() => {
    return students.reduce((acc, student) => {
      acc[student.id] = student.studentCode;
      return acc;
    }, {} as Record<string, string>);
  }, [students]);

  const tuitionMap = useMemo(() => {
    return tuitions.reduce((acc, tuition) => {
      acc[tuition.id] = {
        semester: tuition.semester,
        year: tuition.year,
        academicYear: tuition.academicYear,
        price: tuition.price,
      };
      return acc;
    }, {} as Record<string, { semester: string; year: string; academicYear: string; price: number }>);
  }, [tuitions]);

  // Filter student tuitions
  const filteredStudentTuitions = useMemo(() => {
    let result = studentTuitionsData || [];

    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      result = result.filter((st) =>
        studentMap[st.studentId]?.toLowerCase().includes(searchLower)
      );
    }

    if (selectedStudentId) {
      result = result.filter((st) => st.studentId === selectedStudentId);
    }

    if (selectedTuitionId) {
      result = result.filter((st) => st.tuitionId === selectedTuitionId);
    }

    return result;
  }, [
    studentTuitionsData,
    debouncedSearch,
    selectedStudentId,
    selectedTuitionId,
    studentMap,
  ]);

  const handleStudentFilterChange = (event: SelectChangeEvent) => {
    setSelectedStudentId(event.target.value);
  };

  const handleTuitionFilterChange = (event: SelectChangeEvent) => {
    setSelectedTuitionId(event.target.value);
  };

  const handleAddStudentTuition = () => {
    setEditingStudentTuition(null);
    setFormOpen(true);
  };

  const handleEditStudentTuition = (st: StudentTuition) => {
    setEditingStudentTuition(st);
    setFormOpen(true);
  };

  const handleDeleteClick = (st: StudentTuition) => {
    setStudentTuitionToDelete(st);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = (data: CreateStudentTuitionRequest) => {
    if (editingStudentTuition) {
      updateStudentTuitionMutation.mutate(
        { id: editingStudentTuition.id, data },
        {
          onSuccess: () => {
            toast.success("Cập nhật học phí sinh viên thành công");
            setFormOpen(false);
          },
          onError: (error: any) => {
            toast.error(error.response?.data?.message || "Có lỗi xảy ra");
          },
        }
      );
    } else {
      createStudentTuitionMutation.mutate(data, {
        onSuccess: () => {
          toast.success("Thêm học phí sinh viên thành công");
          setFormOpen(false);
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Có lỗi xảy ra");
        },
      });
    }
  };

  const handleConfirmDelete = () => {
    if (studentTuitionToDelete) {
      deleteStudentTuitionMutation.mutate(studentTuitionToDelete.id, {
        onSuccess: () => {
          toast.success("Xóa học phí sinh viên thành công");
          setDeleteDialogOpen(false);
          setStudentTuitionToDelete(null);
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Có lỗi xảy ra");
        },
      });
    }
  };

  const handleCalculateTuition = async (studentId: string) => {
    try {
      setIsCalculating(true);
      const result = await tuitionCalculationService.calculateStudentTuition(
        studentId
      );
      if (result && result.length > 0) {
        setCalculationData(result[0]);
        setCalculationDialogOpen(true);
      } else {
        toast.error("Không thể tính học phí cho sinh viên này");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi tính học phí"
      );
    } finally {
      setIsCalculating(false);
    }
  };

  // Format price
  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + " VNĐ";
  };

  // Calculate final price
  const calculateFinalPrice = (tuitionId: string, endow?: number) => {
    const tuition = tuitionMap[tuitionId];
    if (!tuition) return "-";
    const finalPrice = tuition.price - (endow || 0);
    return formatPrice(finalPrice);
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
          Danh sách học phí sinh viên
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddStudentTuition}
        >
          Thêm mới
        </Button>
      </Box>

      <Paper sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            placeholder="Tìm kiếm theo mã sinh viên..."
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
          <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel>Lọc theo học phí</InputLabel>
            <Select
              value={selectedTuitionId}
              label="Lọc theo học phí"
              onChange={handleTuitionFilterChange}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {tuitions.map((tuition) => (
                <MenuItem key={tuition.id} value={tuition.id}>
                  {tuition.semester} - {tuition.year}
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
                <TableCell>Học kỳ</TableCell>
                <TableCell>Năm học</TableCell>
                <TableCell>Khóa</TableCell>
                <TableCell align="right">Học phí gốc</TableCell>
                <TableCell align="right">Ưu đãi</TableCell>
                <TableCell align="right">Thành tiền</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell align="right">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Typography color="error">
                      Có lỗi xảy ra khi tải dữ liệu
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : filteredStudentTuitions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    Chưa có dữ liệu
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudentTuitions.map((st) => {
                  const tuition = tuitionMap[st.tuitionId];
                  return (
                    <TableRow key={st.id}>
                      <TableCell>
                        <Chip
                          label={studentMap[st.studentId] || st.studentId}
                          color="primary"
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={tuition?.semester || "-"}
                          color="secondary"
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{tuition?.year || "-"}</TableCell>
                      <TableCell>{tuition?.academicYear || "-"}</TableCell>
                      <TableCell align="right">
                        <Typography fontWeight={500}>
                          {tuition ? formatPrice(tuition.price) : "-"}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        {st.endow ? (
                          <Chip
                            label={`-${formatPrice(st.endow)}`}
                            color="success"
                            size="small"
                          />
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight={600} color="primary">
                          {calculateFinalPrice(st.tuitionId, st.endow)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {new Date(st.createdAt).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          onClick={() => handleEditStudentTuition(st)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="info"
                          onClick={() => handleCalculateTuition(st.studentId)}
                          disabled={isCalculating}
                          title="Tính học phí tự động"
                        >
                          <CalculateIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteClick(st)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <StudentTuitionFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingStudentTuition}
        isLoading={
          createStudentTuitionMutation.isPending ||
          updateStudentTuitionMutation.isPending
        }
      />

      <StudentTuitionDeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteStudentTuitionMutation.isPending}
      />

      <TuitionCalculationDialog
        open={calculationDialogOpen}
        onClose={() => setCalculationDialogOpen(false)}
        data={calculationData}
        isLoading={isCalculating}
      />
    </Box>
  );
};
