import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Alert,
} from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

interface NewsDeleteDialogProps {
  open: boolean;
  count: number;
  title?: string; // If deleting single item
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  error?: string | null;
}

export const NewsDeleteDialog = ({
  open,
  count,
  title,
  onClose,
  onConfirm,
  isLoading,
  error,
}: NewsDeleteDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={!isLoading ? onClose : undefined}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
        },
      }}
    >
      <Box sx={{ textAlign: "center", pt: 3, px: 3 }}>
        <Box
          sx={{
            display: "inline-flex",
            p: 2,
            borderRadius: "50%",
            backgroundColor: "#FEF2F2",
            mb: 2,
          }}
        >
          <WarningAmberRoundedIcon sx={{ fontSize: 40, color: "#DC2626" }} />
        </Box>

        <DialogTitle sx={{ p: 0, mb: 1, fontWeight: 700, fontSize: "1.25rem" }}>
          Xác nhận xóa tin tức
        </DialogTitle>
      </Box>

      <DialogContent sx={{ px: 3, pb: 2 }}>
        <DialogContentText sx={{ textAlign: "center", color: "text.secondary", mb: 2 }}>
          {count === 1 && title ? (
            <>
              Bạn có chắc chắn muốn xóa tin tức <strong>{title}</strong>?
            </>
          ) : (
            <>
              Bạn có chắc chắn muốn xóa <strong>{count}</strong> tin tức đã chọn?
            </>
          )}
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
        <Button onClick={onClose} variant="outlined" color="inherit" disabled={isLoading}>
          Hủy bỏ
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={isLoading}
        >
          {isLoading ? "Đang xóa..." : "Xóa"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
