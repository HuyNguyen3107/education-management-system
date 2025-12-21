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
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import type { SelectChangeEvent } from "@mui/material";
import { useState, useMemo } from "react";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useCreditClasses } from "../../credit-classes/queries/credit-class.queries";
import {
  useStudentCreditClasses,
  useUpdateStudentCreditClass,
} from "../queries/student-credit-class.queries";
import { useStudents } from "../../students/queries/student.queries";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { toast } from "react-toastify";
import type { StudentCreditClass } from "../types/student-credit-class.types";

interface GradeFormData {
  attendance: number;
  midterm: number;
  practice: number;
  homework: number;
  final: number;
}

const DEFAULT_WEIGHTS = {
  attendance: 10,
  midterm: 10,
  practice: 20,
  homework: 0,
  final: 60,
};

const calculateGrade = (grades: GradeFormData) => {
  const weights = DEFAULT_WEIGHTS;
  const totalWeight =
    weights.attendance +
    weights.midterm +
    weights.practice +
    weights.homework +
    weights.final;

  const total10 =
    (grades.attendance * weights.attendance +
      grades.midterm * weights.midterm +
      grades.practice * weights.practice +
      grades.homework * weights.homework +
      grades.final * weights.final) /
    totalWeight;

  let total4 = 0;
  let letter = "F";

  if (total10 >= 8.5) {
    total4 = 4.0;
    letter = "A";
  } else if (total10 >= 8.0) {
    total4 = 3.5;
    letter = "B+";
  } else if (total10 >= 7.0) {
    total4 = 3.0;
    letter = "B";
  } else if (total10 >= 6.5) {
    total4 = 2.5;
    letter = "C+";
  } else if (total10 >= 5.5) {
    total4 = 2.0;
    letter = "C";
  } else if (total10 >= 5.0) {
    total4 = 1.5;
    letter = "D+";
  } else if (total10 >= 4.0) {
    total4 = 1.0;
    letter = "D";
  } else {
    total4 = 0.0;
    letter = "F";
  }

  return {
    total_10: parseFloat(total10.toFixed(2)),
    total_4: total4,
    letter,
    passed: total10 >= 4.0,
  };
};

export const GradeEntryPage = () => {
  usePageMeta("Nhập điểm sinh viên");

  const [selectedCreditClassId, setSelectedCreditClassId] = useState<string>("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] =
    useState<StudentCreditClass | null>(null);
  const [grades, setGrades] = useState<GradeFormData>({
    attendance: 0,
    midterm: 0,
    practice: 0,
    homework: 0,
    final: 0,
  });

  const { data: creditClasses = [], isLoading: loadingCreditClasses } =
    useCreditClasses();
  const { data: studentCreditClassesData = [], isLoading: loadingEnrollments } =
    useStudentCreditClasses();
  const { data: students = [] } = useStudents();
  const updateMutation = useUpdateStudentCreditClass();

  // Create student lookup map
  const studentMap = useMemo(() => {
    return students.reduce(
      (acc, student) => {
        acc[student.id] = {
          code: student.studentCode,
          name: student.studentCode, // Use student code as name since we don't have name in Student type
        };
        return acc;
      },
      {} as Record<string, { code: string; name: string }>
    );
  }, [students]);

  // Filter enrollments by selected credit class
  const filteredEnrollments = useMemo(() => {
    if (!selectedCreditClassId) return [];
    return studentCreditClassesData.filter(
      (scc) => scc.creditClassId === selectedCreditClassId
    );
  }, [studentCreditClassesData, selectedCreditClassId]);



  const handleCreditClassChange = (event: SelectChangeEvent) => {
    setSelectedCreditClassId(event.target.value);
  };

  const handleOpenDialog = (enrollment: StudentCreditClass) => {
    setSelectedEnrollment(enrollment);

    // Parse existing scores if available
    const scores = enrollment.scores as any;
    if (scores && Array.isArray(scores)) {
      // Old format: array of ScoreItem
      const scoreMap: Record<string, number> = {};
      scores.forEach((s: any) => {
        if (s.name === "Chuyên cần") scoreMap.attendance = s.score || 0;
        else if (s.name === "Kiểm tra") scoreMap.midterm = s.score || 0;
        else if (s.name === "Thực hành") scoreMap.practice = s.score || 0;
        else if (s.name === "Bài tập") scoreMap.homework = s.score || 0;
        else if (s.name === "Điểm thi") scoreMap.final = s.score || 0;
      });
      setGrades({
        attendance: scoreMap.attendance || 0,
        midterm: scoreMap.midterm || 0,
        practice: scoreMap.practice || 0,
        homework: scoreMap.homework || 0,
        final: scoreMap.final || 0,
      });
    } else if (scores && typeof scores === "object") {
      // New format: object with keys
      setGrades({
        attendance: scores.attendance || 0,
        midterm: scores.midterm || 0,
        practice: scores.practice || 0,
        homework: scores.homework || 0,
        final: scores.final || 0,
      });
    } else {
      setGrades({
        attendance: 0,
        midterm: 0,
        practice: 0,
        homework: 0,
        final: 0,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEnrollment(null);
  };

  const handleSaveGrades = () => {
    if (!selectedEnrollment) return;

    const calculated = calculateGrade(grades);

    const newScores = {
      ...grades,
      ...calculated,
      components: [
        {
          name: "Chuyên cần",
          weight: DEFAULT_WEIGHTS.attendance,
          score: grades.attendance,
        },
        {
          name: "Kiểm tra",
          weight: DEFAULT_WEIGHTS.midterm,
          score: grades.midterm,
        },
        {
          name: "Thực hành",
          weight: DEFAULT_WEIGHTS.practice,
          score: grades.practice,
        },
        {
          name: "Bài tập",
          weight: DEFAULT_WEIGHTS.homework,
          score: grades.homework,
        },
        { name: "Điểm thi", weight: DEFAULT_WEIGHTS.final, score: grades.final },
      ],
    };

    updateMutation.mutate(
      {
        id: selectedEnrollment.id,
        data: { scores: newScores as any },
      },
      {
        onSuccess: () => {
          toast.success("Lưu điểm thành công!");
          handleCloseDialog();
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
        },
      }
    );
  };

  const getScoreDisplay = (enrollment: StudentCreditClass) => {
    const scores = enrollment.scores as any;
    if (!scores) return { total10: "-", letter: "-" };

    if (typeof scores === "object" && scores.total_10 !== undefined) {
      return {
        total10: scores.total_10?.toFixed(2) || "-",
        letter: scores.letter || "-",
      };
    }
    return { total10: "-", letter: "-" };
  };

  // Calculate stats
  const stats = useMemo(() => {
    if (filteredEnrollments.length === 0) {
      return { total: 0, graded: 0, passed: 0, passRate: 0 };
    }

    let graded = 0;
    let passed = 0;

    filteredEnrollments.forEach((e) => {
      const scores = e.scores as any;
      if (scores && scores.total_10 !== undefined) {
        graded++;
        if (scores.passed) passed++;
      }
    });

    return {
      total: filteredEnrollments.length,
      graded,
      passed,
      passRate: graded > 0 ? Math.round((passed / graded) * 100) : 0,
    };
  }, [filteredEnrollments]);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
          Nhập điểm sinh viên
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Chọn lớp tín chỉ để nhập điểm cho sinh viên
        </Typography>
      </Box>

      {/* Credit Class Selector */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel>Chọn lớp tín chỉ</InputLabel>
          <Select
            value={selectedCreditClassId}
            label="Chọn lớp tín chỉ"
            onChange={handleCreditClassChange}
          >
            <MenuItem value="">
              <em>-- Chọn lớp tín chỉ --</em>
            </MenuItem>
            {creditClasses.map((cc) => (
              <MenuItem key={cc.id} value={cc.id}>
                {cc.subjectCode} - {cc.name} (Học kỳ: {cc.semester}, Nhóm:{" "}
                {cc.group})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {loadingCreditClasses || loadingEnrollments ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : !selectedCreditClassId ? (
        <Alert severity="info">
          Vui lòng chọn lớp tín chỉ để xem danh sách sinh viên và nhập điểm.
        </Alert>
      ) : filteredEnrollments.length === 0 ? (
        <Alert severity="warning">
          Chưa có sinh viên nào đăng ký lớp tín chỉ này.
        </Alert>
      ) : (
        <>
          {/* Stats */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 3 }}>
              <Paper
                sx={{
                  p: 2,
                  textAlign: "center",
                  border: "1px solid #e5e7eb",
                  borderRadius: 2,
                }}
                elevation={0}
              >
                <Typography variant="h4" sx={{ fontWeight: 700, color: "primary.main" }}>
                  {stats.total}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tổng sinh viên
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Paper
                sx={{
                  p: 2,
                  textAlign: "center",
                  border: "1px solid #e5e7eb",
                  borderRadius: 2,
                }}
                elevation={0}
              >
                <Typography variant="h4" sx={{ fontWeight: 700, color: "info.main" }}>
                  {stats.graded}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Đã nhập điểm
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Paper
                sx={{
                  p: 2,
                  textAlign: "center",
                  border: "1px solid #e5e7eb",
                  borderRadius: 2,
                }}
                elevation={0}
              >
                <Typography variant="h4" sx={{ fontWeight: 700, color: "success.main" }}>
                  {stats.passed}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Đạt
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Paper
                sx={{
                  p: 2,
                  textAlign: "center",
                  border: "1px solid #e5e7eb",
                  borderRadius: 2,
                }}
                elevation={0}
              >
                <Typography variant="h4" sx={{ fontWeight: 700, color: "warning.main" }}>
                  {stats.passRate}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tỷ lệ đạt
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Student Table */}
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              border: "1px solid #e5e7eb",
              borderRadius: 2,
            }}
          >
            <Table>
              <TableHead sx={{ bgcolor: "#f9fafb" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>STT</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Mã SV</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    Chuyên cần ({DEFAULT_WEIGHTS.attendance}%)
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    Kiểm tra ({DEFAULT_WEIGHTS.midterm}%)
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    Thực hành ({DEFAULT_WEIGHTS.practice}%)
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    Bài tập ({DEFAULT_WEIGHTS.homework}%)
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    Điểm thi ({DEFAULT_WEIGHTS.final}%)
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    Tổng kết (10)
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    Điểm chữ
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    Thao tác
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEnrollments.map((enrollment, index) => {
                  const scores = enrollment.scores as any;
                  const scoreDisplay = getScoreDisplay(enrollment);
                  const student = studentMap[enrollment.studentId];

                  return (
                    <TableRow key={enrollment.id} hover>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Chip
                          label={student?.code || enrollment.studentId}
                          color="primary"
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        {scores?.attendance ?? "-"}
                      </TableCell>
                      <TableCell align="center">
                        {scores?.midterm ?? "-"}
                      </TableCell>
                      <TableCell align="center">
                        {scores?.practice ?? "-"}
                      </TableCell>
                      <TableCell align="center">
                        {scores?.homework ?? "-"}
                      </TableCell>
                      <TableCell align="center">
                        {scores?.final ?? "-"}
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>
                        {scoreDisplay.total10}
                      </TableCell>
                      <TableCell align="center">
                        {scoreDisplay.letter !== "-" && (
                          <Chip
                            label={scoreDisplay.letter}
                            color={
                              scoreDisplay.letter === "F" ? "error" : "success"
                            }
                            size="small"
                            variant={
                              scoreDisplay.letter === "F" ? "filled" : "outlined"
                            }
                            sx={{ fontWeight: 700, minWidth: 40 }}
                          />
                        )}
                        {scoreDisplay.letter === "-" && "-"}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Nhập điểm">
                          <IconButton
                            color="primary"
                            onClick={() => handleOpenDialog(enrollment)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Grade Entry Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Nhập điểm sinh viên</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {selectedEnrollment && (
              <Typography variant="subtitle1" gutterBottom>
                Sinh viên:{" "}
                <strong>
                  {studentMap[selectedEnrollment.studentId]?.code ||
                    selectedEnrollment.studentId}
                </strong>
              </Typography>
            )}

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={6}>
                <TextField
                  label={`Chuyên cần (${DEFAULT_WEIGHTS.attendance}%)`}
                  type="number"
                  fullWidth
                  value={grades.attendance}
                  onChange={(e) =>
                    setGrades({ ...grades, attendance: Number(e.target.value) })
                  }
                  inputProps={{ min: 0, max: 10, step: 0.1 }}
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  label={`Kiểm tra (${DEFAULT_WEIGHTS.midterm}%)`}
                  type="number"
                  fullWidth
                  value={grades.midterm}
                  onChange={(e) =>
                    setGrades({ ...grades, midterm: Number(e.target.value) })
                  }
                  inputProps={{ min: 0, max: 10, step: 0.1 }}
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  label={`Thực hành (${DEFAULT_WEIGHTS.practice}%)`}
                  type="number"
                  fullWidth
                  value={grades.practice}
                  onChange={(e) =>
                    setGrades({ ...grades, practice: Number(e.target.value) })
                  }
                  inputProps={{ min: 0, max: 10, step: 0.1 }}
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  label={`Bài tập (${DEFAULT_WEIGHTS.homework}%)`}
                  type="number"
                  fullWidth
                  value={grades.homework}
                  onChange={(e) =>
                    setGrades({ ...grades, homework: Number(e.target.value) })
                  }
                  inputProps={{ min: 0, max: 10, step: 0.1 }}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  label={`Điểm thi (${DEFAULT_WEIGHTS.final}%)`}
                  type="number"
                  fullWidth
                  value={grades.final}
                  onChange={(e) =>
                    setGrades({ ...grades, final: Number(e.target.value) })
                  }
                  inputProps={{ min: 0, max: 10, step: 0.1 }}
                />
              </Grid>
            </Grid>

            {/* Preview calculated grades */}
            <Paper variant="outlined" sx={{ p: 2, mt: 3, bgcolor: "#f9fafb" }}>
              <Typography variant="subtitle2" gutterBottom>
                Điểm tính toán:
              </Typography>
              {(() => {
                const calculated = calculateGrade(grades);
                return (
                  <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Tổng kết (10):
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {calculated.total_10}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Tổng kết (4):
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {calculated.total_4}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Điểm chữ:
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        <Chip
                          label={calculated.letter}
                          color={calculated.letter === "F" ? "error" : "success"}
                          size="small"
                        />
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Kết quả:
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        <Chip
                          label={calculated.passed ? "Đạt" : "Không đạt"}
                          color={calculated.passed ? "success" : "error"}
                          size="small"
                        />
                      </Typography>
                    </Box>
                  </Box>
                );
              })()}
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button
            onClick={handleSaveGrades}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Đang lưu..." : "Lưu điểm"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
