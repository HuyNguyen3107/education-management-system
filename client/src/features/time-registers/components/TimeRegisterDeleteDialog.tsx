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
  Box,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import type { TimeRegister } from "../types/time-register.types";

interface TimeRegisterDeleteDialogProps {
  open: boolean;
  timeRegister: TimeRegister | null;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export const TimeRegisterDeleteDialog = ({
  open,
  timeRegister,
  onClose,
  onConfirm,
  isLoading,
  error,
}: TimeRegisterDeleteDialogProps) => {
  const formatDateTime = (dateTimeString: string) => {
    try {
      return new Date(dateTimeString).toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateTimeString;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Xác nhận xóa thời gian đăng ký</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <DialogContentText>
          Bạn có chắc chắn muốn xóa thời gian đăng ký này?
          {timeRegister && (
            <Box sx={{ mt: 2, p: 2, bgcolor: "#f9fafb", borderRadius: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Loại học kỳ:</strong> {timeRegister.typeSemester || "-"}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Loại đăng ký:</strong> {timeRegister.typeRegister || "-"}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
                <AccessTimeIcon sx={{ fontSize: 16, color: "primary.main" }} />
                <Typography variant="body2">
                  <strong>Thời gian mở:</strong> {formatDateTime(timeRegister.openTime)}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <AccessTimeIcon sx={{ fontSize: 16, color: "error.main" }} />
                <Typography variant="body2">
                  <strong>Thời gian đóng:</strong> {formatDateTime(timeRegister.endTime)}
                </Typography>
              </Box>
            </Box>
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

