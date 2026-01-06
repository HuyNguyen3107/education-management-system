import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Chip,
  Alert,
  CircularProgress,
} from "@mui/material";
import type { TuitionCalculation } from "../types/tuition-calculation.types";

interface TuitionCalculationDialogProps {
  open: boolean;
  onClose: () => void;
  data: TuitionCalculation | null;
  isLoading?: boolean;
}

export const TuitionCalculationDialog = ({
  open,
  onClose,
  data,
  isLoading,
}: TuitionCalculationDialogProps) => {
  if (isLoading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Tính học phí</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  if (!data) {
    return null;
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Chi tiết tính học phí</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          {/* Student Information */}
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Mã sinh viên:</strong> {data.studentCode} |{" "}
              <strong>Niên khóa:</strong> {data.academicYear}
            </Typography>
          </Alert>

          {/* Current Progress */}
          <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
            <Typography variant="h6" gutterBottom>
              Tiến độ học tập hiện tại
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
              <Chip
                label={`Năm thứ ${data.currentYearNumber}`}
                color="primary"
                variant="outlined"
              />
              <Chip
                label={`Học kỳ ${data.currentSemester}`}
                color="secondary"
                variant="outlined"
              />
              <Chip
                label={`Năm học ${data.currentYear}`}
                color="info"
                variant="outlined"
              />
            </Box>
          </Paper>

          {/* Tuition Calculation */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Thông tin tính học phí
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" gutterBottom>
                <strong>Tổng số tín chỉ:</strong> {data.totalCredits}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Học phí mỗi tín chỉ:</strong>{" "}
                {formatCurrency(data.pricePerCredit)}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h5" color="primary" gutterBottom>
                <strong>Tổng học phí:</strong>{" "}
                {formatCurrency(data.totalTuition)}
              </Typography>
            </Box>
          </Paper>

          {/* Subject Details */}
          <Typography variant="h6" gutterBottom>
            Chi tiết môn học đã đăng ký
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Mã môn học</TableCell>
                  <TableCell>Tên môn học</TableCell>
                  <TableCell align="right">Số tín chỉ</TableCell>
                  <TableCell>Học kỳ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.subjectDetails.map((subject, index) => (
                  <TableRow key={index}>
                    <TableCell>{subject.subjectCode}</TableCell>
                    <TableCell>{subject.subjectName}</TableCell>
                    <TableCell align="right">{subject.credits}</TableCell>
                    <TableCell>{subject.semester}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Calculation Formula */}
          <Alert severity="success" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Công thức tính:</strong> Tổng học phí = Tổng số tín chỉ (×
              {data.totalCredits}) × Học phí mỗi tín chỉ (
              {formatCurrency(data.pricePerCredit)}) ={" "}
              {formatCurrency(data.totalTuition)}
            </Typography>
          </Alert>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};
