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
import type { NotificationWithUser } from "../types/notification.types";

interface NotificationDeleteDialogProps {
  open: boolean;
  notification: NotificationWithUser | null;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export const NotificationDeleteDialog = ({
  open,
  notification,
  onClose,
  onConfirm,
  isLoading,
  error,
}: NotificationDeleteDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Xác nhận xóa thông báo</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <DialogContentText>
          Bạn có chắc chắn muốn xóa thông báo{" "}
          <strong>{notification?.title}</strong>?
          {notification?.user && (
            <>
              <br />
              <Typography component="span" variant="body2" sx={{ mt: 1, display: "block" }}>
                Người nhận: {notification.user.fullName} ({notification.user.email})
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

