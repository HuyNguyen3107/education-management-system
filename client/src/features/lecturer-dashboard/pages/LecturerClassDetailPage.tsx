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
  Grid,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import {
  useLecturerClassStudents,
  useUpdateStudentGrade,
} from "../queries/lecturer-dashboard.queries";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useState } from "react";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import type { LecturerStudent } from "../types/lecturer-dashboard.types";

export const LecturerClassDetailPage = () => {
  usePageMeta("Chi tiết lớp học");
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: students, isLoading } = useLecturerClassStudents(id || "");
  const updateGradeMutation = useUpdateStudentGrade(id || "");

  const [selectedStudent, setSelectedStudent] =
    useState<LecturerStudent | null>(null);
  const [openGradeDialog, setOpenGradeDialog] = useState(false);

  // Grade form state
  const [grades, setGrades] = useState({
    attendance: 0,
    midterm: 0,
    final: 0,
  });

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  const handleOpenGradeDialog = (student: LecturerStudent) => {
    setSelectedStudent(student);
    const currentScores = student.scores || {};
    setGrades({
      attendance: currentScores.attendance || 0,
      midterm: currentScores.midterm || 0,
      final: currentScores.final || 0,
    });
    setOpenGradeDialog(true);
  };

  const handleCloseGradeDialog = () => {
    setOpenGradeDialog(false);
    setSelectedStudent(null);
  };

  const handleSaveGrades = () => {
    if (!selectedStudent) return;

    // Calculate total scores
    // Example formula: 10% Attendance + 40% Midterm + 50% Final
    const total10 = (
      (grades.attendance || 0) * 0.1 +
      (grades.midterm || 0) * 0.4 +
      (grades.final || 0) * 0.5
    ).toFixed(1);

    // Simple logic for 4.0 scale (approximate)
    let total4 = 0;
    let letter = "F";
    const score = parseFloat(total10);

    if (score >= 8.5) {
      total4 = 4.0;
      letter = "A";
    } else if (score >= 8.0) {
      total4 = 3.5;
      letter = "B+";
    } else if (score >= 7.0) {
      total4 = 3.0;
      letter = "B";
    } else if (score >= 6.5) {
      total4 = 2.5;
      letter = "C+";
    } else if (score >= 5.5) {
      total4 = 2.0;
      letter = "C";
    } else if (score >= 5.0) {
      total4 = 1.5;
      letter = "D+";
    } else if (score >= 4.0) {
      total4 = 1.0;
      letter = "D";
    } else {
      total4 = 0.0;
      letter = "F";
    }

    const newScores = {
      ...grades,
      total_10: parseFloat(total10),
      total_4: total4,
      letter: letter,
      passed: score >= 4.0,
      components: [
        { name: "Chuyên cần", weight: 10, score: grades.attendance || 0 },
        { name: "Giữa kỳ", weight: 40, score: grades.midterm || 0 },
        { name: "Cuối kỳ", weight: 50, score: grades.final || 0 },
      ],
    };

    updateGradeMutation.mutate(
      {
        studentId: selectedStudent.studentId,
        data: { scores: newScores },
      },
      {
        onSuccess: () => {
          handleCloseGradeDialog();
        },
      }
    );
  };

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/lecturer/classes")}
        sx={{ mb: 2 }}
      >
        Quay lại
      </Button>

      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
        Danh sách sinh viên
      </Typography>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: "#f9fafb" }}>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Mã SV</TableCell>
              <TableCell>Họ và tên</TableCell>
              <TableCell align="center">Chuyên cần (10%)</TableCell>
              <TableCell align="center">Giữa kỳ (40%)</TableCell>
              <TableCell align="center">Cuối kỳ (50%)</TableCell>
              <TableCell align="center">Tổng kết (10)</TableCell>
              <TableCell align="center">Điểm chữ</TableCell>
              <TableCell align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students?.map((student, index) => {
              const scores = student.scores || {};
              return (
                <TableRow key={student.studentId} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{student.studentCode}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>
                    {student.studentName}
                  </TableCell>
                  <TableCell align="center">
                    {scores.attendance ?? "-"}
                  </TableCell>
                  <TableCell align="center">{scores.midterm ?? "-"}</TableCell>
                  <TableCell align="center">{scores.final ?? "-"}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>
                    {scores.total_10 ?? "-"}
                  </TableCell>
                  <TableCell align="center">
                    {scores.letter && (
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color:
                            scores.letter === "F"
                              ? "error.main"
                              : "success.main",
                        }}
                      >
                        {scores.letter}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleOpenGradeDialog(student)}
                    >
                      Nhập điểm
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {students?.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                  Chưa có sinh viên nào trong lớp này.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Grade Dialog */}
      <Dialog
        open={openGradeDialog}
        onClose={handleCloseGradeDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Nhập điểm sinh viên</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <Typography variant="subtitle1" gutterBottom>
              Sinh viên: <b>{selectedStudent?.studentName}</b> (
              {selectedStudent?.studentCode})
            </Typography>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={12}>
                <TextField
                  label="Điểm chuyên cần (10%)"
                  type="number"
                  fullWidth
                  value={grades.attendance}
                  onChange={(e) =>
                    setGrades({ ...grades, attendance: Number(e.target.value) })
                  }
                  inputProps={{ min: 0, max: 10, step: 0.1 }}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  label="Điểm giữa kỳ (40%)"
                  type="number"
                  fullWidth
                  value={grades.midterm}
                  onChange={(e) =>
                    setGrades({ ...grades, midterm: Number(e.target.value) })
                  }
                  inputProps={{ min: 0, max: 10, step: 0.1 }}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  label="Điểm cuối kỳ (50%)"
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseGradeDialog}>Hủy</Button>
          <Button
            onClick={handleSaveGrades}
            variant="contained"
            disabled={updateGradeMutation.isPending}
          >
            Lưu điểm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
