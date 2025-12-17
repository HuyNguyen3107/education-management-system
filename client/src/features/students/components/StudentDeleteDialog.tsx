import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import type { StudentWithUserData } from "../../pages/StudentsPage";

interface StudentDeleteDialogProps {
  open: boolean;
  student: StudentWithUserData | null;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export const StudentDeleteDialog = ({
  open,
  student,
  onClose,
  onConfirm,
  isLoading,
  error,
}: StudentDeleteDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Xác nhận xóa sinh viên</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <DialogContentText>
          Bạn có chắc chắn muốn xóa sinh viên{" "}
          <strong>{student?.studentCode}</strong>?
          {student?.user && (
            <>
              <br />
              <Typography component="span" variant="body2" sx={{ mt: 1, display: "block" }}>
                Thông tin: {student.user.fullName} ({student.user.email})
              </Typography>
            </>
          )}
          <br />
          <Typography component="span" variant="body2" color="error" sx={{ mt: 1, display: "block" }}>
            Hành động này không thể hoàn tác.
          </Typography>
        </DialogContentText>
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
          {isLoading ? <CircularProgress size={20} /> : "Xóa"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

