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
  useStudentCreditClasses,
  useCreateStudentCreditClass,
  useUpdateStudentCreditClass,
  useDeleteStudentCreditClass,
} from "../queries/student-credit-class.queries";
import { useStudents } from "../../students/queries/student.queries";
import { useCreditClasses } from "../../credit-classes/queries/credit-class.queries";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useState, useEffect, useMemo } from "react";
import { StudentCreditClassFormDialog } from "../components/StudentCreditClassFormDialog";
import { StudentCreditClassDeleteDialog } from "../components/StudentCreditClassDeleteDialog";
import { StudentCreditClassDetailDialog } from "../components/StudentCreditClassDetailDialog";
import type { StudentCreditClass, CreateStudentCreditClassRequest, ScoreItem, ExamScheduleItem } from "../types/student-credit-class.types";
import { toast } from "react-toastify";
import { usePageMeta } from "@/hooks/usePageMeta";

export const StudentCreditClassesPage = () => {
  usePageMeta("Quản lý đăng ký lớp tín chỉ");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [selectedCreditClassId, setSelectedCreditClassId] = useState<string>("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingStudentCreditClass, setEditingStudentCreditClass] = useState<StudentCreditClass | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentCreditClassToDelete, setStudentCreditClassToDelete] = useState<StudentCreditClass | null>(null);

  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedDetailData, setSelectedDetailData] = useState<StudentCreditClass | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: studentCreditClassesData, isLoading, isError } = useStudentCreditClasses();
  const { data: students = [] } = useStudents();
  const { data: creditClasses = [] } = useCreditClasses();

  const createStudentCreditClassMutation = useCreateStudentCreditClass();
  const updateStudentCreditClassMutation = useUpdateStudentCreditClass();
  const deleteStudentCreditClassMutation = useDeleteStudentCreditClass();

  // Create lookup maps
  const studentMap = useMemo(() => {
    return students.reduce((acc, student) => {
      acc[student.id] = { code: student.studentCode, name: student.studentCode };
      return acc;
    }, {} as Record<string, { code: string; name: string }>);
  }, [students]);

  const creditClassMap = useMemo(() => {
    return creditClasses.reduce((acc, cc) => {
      acc[cc.id] = {
        name: cc.name,
        subjectCode: cc.subjectCode,
        semester: cc.semester,
        schedule: cc.schedule,
        room: cc.room,
      };
      return acc;
    }, {} as Record<string, { name: string; subjectCode: string; semester: string; schedule: string; room?: string }>);
  }, [creditClasses]);

  // Filter student credit classes
  const filteredStudentCreditClasses = useMemo(() => {
    let result = studentCreditClassesData || [];

    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      result = result.filter((scc) =>
        studentMap[scc.studentId]?.code?.toLowerCase().includes(searchLower) ||
        studentMap[scc.studentId]?.name?.toLowerCase().includes(searchLower) ||
        creditClassMap[scc.creditClassId]?.name.toLowerCase().includes(searchLower) ||
        creditClassMap[scc.creditClassId]?.subjectCode.toLowerCase().includes(searchLower)
      );
    }

    if (selectedStudentId) {
      result = result.filter((scc) => scc.studentId === selectedStudentId);
    }

    if (selectedCreditClassId) {
      result = result.filter((scc) => scc.creditClassId === selectedCreditClassId);
    }

    return result;
  }, [studentCreditClassesData, debouncedSearch, selectedStudentId, selectedCreditClassId, studentMap, creditClassMap]);

  const handleStudentFilterChange = (event: SelectChangeEvent) => {
    setSelectedStudentId(event.target.value);
  };

  const handleCreditClassFilterChange = (event: SelectChangeEvent) => {
    setSelectedCreditClassId(event.target.value);
  };

  const handleAddStudentCreditClass = () => {
    setEditingStudentCreditClass(null);
    setFormOpen(true);
  };

  const handleEditStudentCreditClass = (scc: StudentCreditClass) => {
    setEditingStudentCreditClass(scc);
    setFormOpen(true);
  };

  const handleDeleteClick = (scc: StudentCreditClass) => {
    setStudentCreditClassToDelete(scc);
    setDeleteDialogOpen(true);
  };

  const handleViewDetail = (scc: StudentCreditClass) => {
    setSelectedDetailData(scc);
    setDetailDialogOpen(true);
  };

  const handleFormSubmit = (data: CreateStudentCreditClassRequest) => {
    if (editingStudentCreditClass) {
      updateStudentCreditClassMutation.mutate(
        { id: editingStudentCreditClass.id, data },
        {
          onSuccess: () => {
            toast.success("Cập nhật thành công");
            setFormOpen(false);
          },
          onError: (error: any) => {
            toast.error(error.response?.data?.message || "Có lỗi xảy ra");
          },
        }
      );
    } else {
      createStudentCreditClassMutation.mutate(data, {
        onSuccess: () => {
          toast.success("Đăng ký lớp tín chỉ thành công");
          setFormOpen(false);
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Có lỗi xảy ra");
        },
      });
    }
  };

  const handleConfirmDelete = () => {
    if (studentCreditClassToDelete) {
      deleteStudentCreditClassMutation.mutate(studentCreditClassToDelete.id, {
        onSuccess: () => {
          toast.success("Hủy đăng ký thành công");
          setDeleteDialogOpen(false);
          setStudentCreditClassToDelete(null);
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Có lỗi xảy ra");
        },
      });
    }
  };

  // Calculate average score
  const calculateAvgScore = (scores?: ScoreItem[]) => {
    if (!scores || scores.length === 0) return null;
    const totalWeight = scores.reduce((sum, s) => sum + s.percentage, 0);
    if (totalWeight === 0) return null;
    const weightedSum = scores.reduce((sum, s) => sum + (s.score * s.percentage), 0);
    return (weightedSum / totalWeight).toFixed(2);
  };

  // Format scores for display
  const formatScores = (scores?: ScoreItem[]) => {
    if (!scores || scores.length === 0) return "Chưa có điểm";
    return scores.map((s) => `${s.name}: ${s.score} (${s.percentage}%)`).join(", ");
  };

  // Format exam schedule for display
  const formatExamSchedule = (examSchedule?: ExamScheduleItem[]) => {
    if (!examSchedule || examSchedule.length === 0) return "Chưa có lịch thi";
    return examSchedule.map((e) => `${e.examType}: ${e.examDate} ${e.startTime} - ${e.room}`).join("; ");
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
          Quản lý đăng ký lớp tín chỉ
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddStudentCreditClass}
        >
          Đăng ký mới
        </Button>
      </Box>

      <Paper sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            placeholder="Tìm kiếm..."
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
            <InputLabel>Lọc theo lớp tín chỉ</InputLabel>
            <Select
              value={selectedCreditClassId}
              label="Lọc theo lớp tín chỉ"
              onChange={handleCreditClassFilterChange}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {creditClasses.map((cc) => (
                <MenuItem key={cc.id} value={cc.id}>
                  {cc.name} - {cc.subjectCode}
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
                <TableCell>Lớp tín chỉ</TableCell>
                <TableCell>Mã môn</TableCell>
                <TableCell>Học kỳ</TableCell>
                <TableCell>Điểm</TableCell>
                <TableCell align="center">Điểm TB</TableCell>
                <TableCell>Lịch thi</TableCell>
                <TableCell>Ngày đăng ký</TableCell>
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
              ) : filteredStudentCreditClasses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    Chưa có dữ liệu
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudentCreditClasses.map((scc) => {
                  const creditClass = creditClassMap[scc.creditClassId];
                  const student = studentMap[scc.studentId];
                  const avgScore = calculateAvgScore(scc.scores);
                  return (
                    <TableRow key={scc.id}>
                      <TableCell>
                        <Chip
                          label={student?.code || scc.studentId}
                          color="primary"
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={500}>
                          {creditClass?.name || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={creditClass?.subjectCode || "-"}
                          color="secondary"
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{creditClass?.semester || "-"}</TableCell>
                      <TableCell>
                        <Tooltip title={formatScores(scc.scores)}>
                          <Typography
                            variant="body2"
                            sx={{
                              maxWidth: 150,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              cursor: "pointer",
                            }}
                          >
                            {formatScores(scc.scores)}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center">
                        {avgScore ? (
                          <Chip
                            label={avgScore}
                            color={parseFloat(avgScore) >= 5 ? "success" : "error"}
                            size="small"
                          />
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        <Tooltip title={formatExamSchedule(scc.examSchedule)}>
                          <Typography
                            variant="body2"
                            sx={{
                              maxWidth: 150,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              cursor: "pointer",
                            }}
                          >
                            {formatExamSchedule(scc.examSchedule)}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        {new Date(scc.createdAt).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Xem chi tiết">
                          <IconButton
                            color="info"
                            onClick={() => handleViewDetail(scc)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Chỉnh sửa">
                          <IconButton
                            color="primary"
                            onClick={() => handleEditStudentCreditClass(scc)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteClick(scc)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <StudentCreditClassFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingStudentCreditClass}
        isLoading={
          createStudentCreditClassMutation.isPending ||
          updateStudentCreditClassMutation.isPending
        }
      />

      <StudentCreditClassDeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteStudentCreditClassMutation.isPending}
      />

      <StudentCreditClassDetailDialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        data={selectedDetailData}
        creditClassName={
          selectedDetailData
            ? creditClassMap[selectedDetailData.creditClassId]?.name
            : undefined
        }
        studentCode={
          selectedDetailData
            ? studentMap[selectedDetailData.studentId]?.code
            : undefined
        }
      />
    </Box>
  );
};
