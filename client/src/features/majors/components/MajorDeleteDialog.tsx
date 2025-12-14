import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

interface MajorDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const MajorDeleteDialog = ({
  open,
  onClose,
  onConfirm,
  isLoading,
}: MajorDeleteDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Xác nhận xóa</DialogTitle>
      <DialogContent>
        <Typography>
          Bạn có chắc chắn muốn xóa ngành học này không? Hành động này không thể hoàn tác.
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
