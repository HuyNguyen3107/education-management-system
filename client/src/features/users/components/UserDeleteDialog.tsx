import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Alert,
  Box,
  CircularProgress,
} from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import type { User } from "../types/user.types";

interface UserDeleteDialogProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  error?: string | null;
}

export const UserDeleteDialog = ({
  open,
  user,
  onClose,
  onConfirm,
  isLoading,
  error,
}: UserDeleteDialogProps) => {
  if (!user) return null;

  return (
    <Dialog
      open={open}
      onClose={!isLoading ? onClose : undefined}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        },
      }}
    >
      <Box sx={{ textAlign: "center", pt: 3, px: 3 }}>
        <Box
          sx={{
            display: "inline-flex",
            p: 2,
            borderRadius: "50%",
            bgcolor: "error.lighter", // We might need to check theme, fallback to #FEF2F2
            backgroundColor: "#FEF2F2",
            mb: 2,
          }}
        >
          <WarningAmberRoundedIcon sx={{ fontSize: 40, color: "#DC2626" }} />
        </Box>

        <DialogTitle
          id="delete-dialog-title"
          sx={{
            p: 0,
            mb: 1,
            fontWeight: 700,
            fontSize: "1.25rem",
          }}
        >
          Xác nhận xóa người dùng
        </DialogTitle>
      </Box>

      <DialogContent sx={{ px: 3, pb: 2 }}>
        <DialogContentText
          id="delete-dialog-description"
          sx={{
            textAlign: "center",
            color: "text.secondary",
            mb: 2,
          }}
        >
          Bạn có chắc chắn muốn xóa người dùng <strong>{user.fullName}</strong>?
          <br />
          Hành động này không thể hoàn tác.
        </DialogContentText>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0, justifyContent: "center", gap: 2 }}>
        <Button
          onClick={onClose}
          disabled={isLoading}
          variant="outlined"
          autoFocus
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            color: "text.secondary",
            borderColor: "divider",
            "&:hover": {
              borderColor: "text.primary",
              bgcolor: "action.hover",
            },
          }}
        >
          Hủy
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isLoading}
          variant="contained"
          color="error"
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            boxShadow: "none",
            bgcolor: "#DC2626",
            "&:hover": {
              bgcolor: "#B91C1C",
              boxShadow: "none",
            },
          }}
          startIcon={
            isLoading ? <CircularProgress size={20} color="inherit" /> : null
          }
        >
          {isLoading ? "Đang xóa..." : "Xóa"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
