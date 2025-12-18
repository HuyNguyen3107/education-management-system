import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

import type { Role } from "@/features/users/types/user.types";

interface RoleDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  roleName?: string;
  role?: Role | null;
}

export const RoleDeleteDialog = ({
  open,
  onClose,
  onConfirm,
  isLoading,
  roleName,
  role,
}: RoleDeleteDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Xác nhận xóa</DialogTitle>
      <DialogContent>
        <Typography>
          Bạn có chắc chắn muốn xóa vai trò{" "}
          {role?.name ? (
            <strong>{role.name}</strong>
          ) : roleName ? (
            <strong>{roleName}</strong>
          ) : (
            "này"
          )}{" "}
          không? Hành động này không thể hoàn tác.
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
