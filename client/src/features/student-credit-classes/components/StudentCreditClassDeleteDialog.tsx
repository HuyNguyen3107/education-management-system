import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

interface StudentCreditClassDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const StudentCreditClassDeleteDialog = ({
  open,
  onClose,
  onConfirm,
  isLoading,
}: StudentCreditClassDeleteDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Xác nhận hủy đăng ký</DialogTitle>
      <DialogContent>
        <Typography>
          Bạn có chắc chắn muốn hủy đăng ký lớp tín chỉ này không? Hành động này
          không thể hoàn tác.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={isLoading}
        >
          {isLoading ? "Đang xóa..." : "Xác nhận"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

