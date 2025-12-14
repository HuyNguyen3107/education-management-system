import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

interface StudentTuitionDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const StudentTuitionDeleteDialog = ({
  open,
  onClose,
  onConfirm,
  isLoading,
}: StudentTuitionDeleteDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Xác nhận xóa</DialogTitle>
      <DialogContent>
        <Typography>
          Bạn có chắc chắn muốn xóa học phí sinh viên này không? Hành động này
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
          {isLoading ? "Đang xóa..." : "Xóa"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

