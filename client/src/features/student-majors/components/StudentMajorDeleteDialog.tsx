import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import type { StudentMajor } from "../types/student-major.types";

interface StudentMajorDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  studentMajor: StudentMajor | null;
  isLoading?: boolean;
  error?: string | null;
}

export const StudentMajorDeleteDialog = ({
  open,
  onClose,
  onConfirm,
  studentMajor,
  isLoading,
  error,
}: StudentMajorDeleteDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Xác nhận xóa</DialogTitle>
      <DialogContent>
        {error && (
          <Box sx={{ mb: 2, p: 2, bgcolor: "error.light", borderRadius: 1 }}>
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          </Box>
        )}
        <DialogContentText>
          Bạn có chắc chắn muốn xóa việc gán ngành/chuyên ngành cho sinh viên{" "}
          <strong>{studentMajor?.studentCode}</strong> không?
        </DialogContentText>
        {studentMajor && (
          <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Sinh viên:</strong> {studentMajor.studentCode} -{" "}
              {studentMajor.studentName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              <strong>Ngành:</strong> {studentMajor.majorName}
            </Typography>
            {studentMajor.specializationName && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                <strong>Chuyên ngành:</strong> {studentMajor.specializationName}
              </Typography>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Hủy
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={isLoading}
        >
          {isLoading ? "Đang xóa..." : "Xóa"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
