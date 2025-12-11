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
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import type { Tuition } from "../types/tuition.types";

interface TuitionDeleteDialogProps {
  open: boolean;
  tuition: Tuition | null;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export const TuitionDeleteDialog = ({
  open,
  tuition,
  onClose,
  onConfirm,
  isLoading,
  error,
}: TuitionDeleteDialogProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Xác nhận xóa học phí</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <DialogContentText>
          Bạn có chắc chắn muốn xóa học phí cho{" "}
          <strong>{tuition?.semester}</strong> - <strong>{tuition?.year}</strong>?
          {tuition && (
            <Box sx={{ mt: 2, p: 2, bgcolor: "#f9fafb", borderRadius: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Niên khóa:</strong> {tuition.academicYear}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <AttachMoneyIcon sx={{ fontSize: 18, color: "success.main" }} />
                <Typography variant="body2">
                  <strong>Học phí:</strong> {formatCurrency(tuition.price)}
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

