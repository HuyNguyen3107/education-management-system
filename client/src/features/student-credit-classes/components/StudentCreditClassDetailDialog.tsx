import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
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
  Divider,
} from "@mui/material";
import type {
  StudentCreditClass,
  ScoreItem,
  ExamScheduleItem,
} from "../types/student-credit-class.types";

interface StudentCreditClassDetailDialogProps {
  open: boolean;
  onClose: () => void;
  data: StudentCreditClass | null;
  creditClassName?: string;
  studentCode?: string;
}

export const StudentCreditClassDetailDialog = ({
  open,
  onClose,
  data,
  creditClassName,
  studentCode,
}: StudentCreditClassDetailDialogProps) => {
  if (!data) return null;

  // Calculate average score
  const calculateAvgScore = (scores?: ScoreItem[]) => {
    if (!Array.isArray(scores) || scores.length === 0) return null;
    const totalWeight = scores.reduce(
      (sum, s) => sum + (s?.percentage ?? 0),
      0
    );
    if (totalWeight === 0) return null;
    const weightedSum = scores.reduce(
      (sum, s) => sum + (s?.score ?? 0) * (s?.percentage ?? 0),
      0
    );
    return weightedSum / totalWeight;
  };

  const avgScore = calculateAvgScore(data.scores);
  const totalPercentage = Array.isArray(data.scores)
    ? data.scores.reduce((sum, s) => sum + (s?.percentage ?? 0), 0)
    : 0;

  // Format date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("vi-VN");
    } catch {
      return dateStr;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: "#1976d2", color: "white" }}>
        <Typography variant="h6" fontWeight={600}>
          {creditClassName || "Chi tiết đăng ký lớp tín chỉ"}
        </Typography>
        {studentCode && (
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Sinh viên: {studentCode}
          </Typography>
        )}
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        {/* Scores Section */}
        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              Điểm thành phần
            </Typography>
            {avgScore !== null && (
              <Chip
                label={`Điểm TB: ${avgScore.toFixed(2)}`}
                color={avgScore >= 5 ? "success" : "error"}
                sx={{ fontWeight: 600 }}
              />
            )}
          </Box>

          {data.scores && data.scores.length > 0 ? (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                    <TableCell sx={{ fontWeight: 600, width: 60 }}>
                      STT
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      Tên thành phần
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">
                      Trọng số (%)
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">
                      Điểm thành phần
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.scores.map((score, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{score.name}</TableCell>
                      <TableCell align="center">{score.percentage}</TableCell>
                      <TableCell align="center">
                        <Typography
                          fontWeight={600}
                          color={
                            score.score >= 5 ? "success.main" : "error.main"
                          }
                        >
                          {score.score.toFixed(1)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow sx={{ bgcolor: "#e3f2fd" }}>
                    <TableCell colSpan={2} sx={{ fontWeight: 600 }}>
                      Tổng cộng
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>
                      {totalPercentage}%
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        fontWeight={700}
                        color={
                          avgScore && avgScore >= 5
                            ? "success.main"
                            : "error.main"
                        }
                      >
                        {avgScore?.toFixed(2) || "-"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Paper variant="outlined" sx={{ p: 3, textAlign: "center" }}>
              <Typography color="text.secondary">Chưa có điểm</Typography>
            </Paper>
          )}
        </Box>

        <Divider />

        {/* Exam Schedule Section */}
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Lịch thi
          </Typography>

          {data.examSchedule && data.examSchedule.length > 0 ? (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                    <TableCell sx={{ fontWeight: 600, width: 60 }}>
                      STT
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Mã MH</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Tên môn học</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">
                      Sĩ số
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Ngày thi</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Giờ bắt đầu</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">
                      Phút
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Phòng thi</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Cơ sở</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      Hình thức thi
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.examSchedule.map((exam, index) => {
                    // Group header row for exam type
                    const showExamTypeHeader =
                      index === 0 ||
                      exam.examType !== data.examSchedule![index - 1].examType;

                    return (
                      <>
                        {showExamTypeHeader && (
                          <TableRow
                            key={`header-${index}`}
                            sx={{ bgcolor: "#fff3e0" }}
                          >
                            <TableCell colSpan={10}>
                              <Typography fontWeight={600} color="warning.dark">
                                Kỳ thi: {exam.examType}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                        <TableRow key={index} hover>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <Chip
                              label={exam.subjectCode}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>{exam.subjectName}</TableCell>
                          <TableCell align="center">{exam.quantity}</TableCell>
                          <TableCell>{formatDate(exam.examDate)}</TableCell>
                          <TableCell>{exam.startTime || "-"}</TableCell>
                          <TableCell align="center">{exam.duration}</TableCell>
                          <TableCell>
                            <Chip
                              label={exam.room || "-"}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>{exam.campus || "-"}</TableCell>
                          <TableCell>
                            <Chip
                              label={exam.examFormat}
                              size="small"
                              color={
                                exam.examFormat === "Tự luận"
                                  ? "info"
                                  : exam.examFormat === "Trắc nghiệm"
                                  ? "success"
                                  : "default"
                              }
                            />
                          </TableCell>
                        </TableRow>
                      </>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Paper variant="outlined" sx={{ p: 3, textAlign: "center" }}>
              <Typography color="text.secondary">Chưa có lịch thi</Typography>
            </Paper>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};
