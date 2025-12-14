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
import type { LecturerWithUserData } from "../../pages/LecturersPage";

interface LecturerDeleteDialogProps {
  open: boolean;
  lecturer: LecturerWithUserData | null;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export const LecturerDeleteDialog = ({
  open,
  lecturer,
  onClose,
  onConfirm,
  isLoading,
  error,
}: LecturerDeleteDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Xác nhận xóa giảng viên</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <DialogContentText>
          Bạn có chắc chắn muốn xóa giảng viên{" "}
          <strong>{lecturer?.teacherCode}</strong>?
          {lecturer?.user && (
            <>
              <br />
              <Typography component="span" variant="body2" sx={{ mt: 1, display: "block" }}>
                Thông tin: {lecturer.user.fullName} ({lecturer.user.email})
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

