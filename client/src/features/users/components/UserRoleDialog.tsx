import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Radio,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  useGetAllRoles,
  useGetUserRolesByUserId,
  useAddRoleToUser,
  useRemoveUserRole,
} from "../queries/user.queries";
import type { UserRole } from "../types/user.types";
import { toast } from "react-toastify";

interface UserRoleDialogProps {
  open: boolean;
  userId: string | null;
  onClose: () => void;
}

export const UserRoleDialog = ({
  open,
  userId,
  onClose,
}: UserRoleDialogProps) => {
  const { data: roles, isLoading: isLoadingRoles } = useGetAllRoles();
  const {
    data: userRoles,
    isLoading: isLoadingUserRoles,
    refetch: refetchUserRoles,
  } = useGetUserRolesByUserId(userId || "");

  const addRoleMutation = useAddRoleToUser();
  const removeUserRoleMutation = useRemoveUserRole();

  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      const current = (userRoles || [])[0] as UserRole | undefined;
      setSelectedRoleId(current ? current.roleId : null);
    } else {
      setSelectedRoleId(null);
    }
  }, [open, userRoles]);

  const handleSelectRole = (roleId: string) => {
    setSelectedRoleId(roleId);
  };

  const handleSave = async () => {
    if (!userId) return;
    if (!selectedRoleId) {
      toast.error("Vui lòng chọn một vai trò");
      return;
    }

    try {
      setIsSubmitting(true);
      const current = (userRoles || []) as UserRole[];

      const operations: Promise<unknown>[] = [];

      // Xóa các vai trò khác hiện có của user
      current.forEach((ur) => {
        if (ur.roleId !== selectedRoleId) {
          operations.push(
            removeUserRoleMutation.mutateAsync({
              userRoleId: ur.id,
              userId,
            })
          );
        }
      });

      const alreadyHasSelectedRole = current.some(
        (ur) => ur.roleId === selectedRoleId
      );

      // Thêm vai trò mới nếu user chưa có
      if (!alreadyHasSelectedRole) {
        operations.push(
          addRoleMutation.mutateAsync({ userId, roleId: selectedRoleId })
        );
      }

      if (operations.length === 0) {
        toast.info("Vai trò người dùng không thay đổi");
        onClose();
        return;
      }

      await Promise.all(operations);
      await refetchUserRoles();
      toast.success("Cập nhật vai trò người dùng thành công");
      onClose();
    } catch (error: any) {
      const msg =
        error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật vai trò";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isLoadingRoles || isLoadingUserRoles;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        Gán vai trò cho người dùng
      </DialogTitle>
      <DialogContent dividers sx={{ pt: 2 }}>
        <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
          Chọn <strong>một</strong> vai trò cho người dùng, sau đó nhấn{" "}
          <strong>Lưu</strong> để cập nhật.
        </Typography>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress size={30} />
          </Box>
        ) : !roles || roles.length === 0 ? (
          <Typography color="text.secondary">
            Chưa có vai trò nào. Vui lòng tạo vai trò trong trang Quản lý vai
            trò.
          </Typography>
        ) : (
          <List dense sx={{ maxHeight: 320, overflowY: "auto" }}>
            {roles.map((role) => {
              const labelId = `checkbox-role-${role.id}`;
              const checked = selectedRoleId === role.id;

              return (
                <ListItemButton
                  key={role.id}
                  onClick={() => handleSelectRole(role.id)}
                  disabled={isSubmitting}
                >
                  <ListItemIcon>
                    <Radio
                      edge="start"
                      checked={checked}
                      tabIndex={-1}
                      inputProps={{ "aria-labelledby": labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={role.name} />
                </ListItemButton>
              );
            })}
          </List>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting}>
          Hủy
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={isSubmitting || !selectedRoleId}
        >
          {isSubmitting ? "Đang lưu..." : "Lưu"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
