import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";
import type { CreateRoleRequest, Role } from "../types/role.types";
import { roleManagementService } from "../services/role-permission.services";

interface RoleFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: CreateRoleRequest) => void;
  initialData?: Role | null;
  // Role data may be partial when coming from caller
  initialRole?: Partial<Role> | null;
  onSaved?: () => void;
  isLoading?: boolean;
}

export const RoleFormDialog = ({
  open,
  onClose,
  onSubmit,
  initialData,
  initialRole,
  onSaved,
  isLoading,
}: RoleFormDialogProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateRoleRequest>({
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    const role = (initialData as any) ?? (initialRole as any);
    if (role) {
      reset({
        name: role.name,
      });
    } else {
      reset({
        name: "",
      });
    }
  }, [initialData, initialRole, reset, open]);

  const handleInternalSubmit = async (data: CreateRoleRequest) => {
    try {
      if (initialData || initialRole) {
        const id = (initialData as any)?.id ?? (initialRole as any)?.id;
        if (id) {
          await roleManagementService.updateRole(id, data.name);
        } else {
          await roleManagementService.createRole(data.name);
        }
      } else {
        await roleManagementService.createRole(data.name);
      }
      onSaved?.();
      onClose();
    } catch (err: any) {
      // TODO: show error toast
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? "Cập nhật vai trò" : "Thêm mới vai trò"}
      </DialogTitle>
      <form
        onSubmit={handleSubmit((data) => {
          if (onSubmit) onSubmit(data);
          else handleInternalSubmit(data);
        })}
      >
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Tên vai trò là bắt buộc" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tên vai trò"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading
              ? "Đang xử lý..."
              : initialData
              ? "Cập nhật"
              : "Thêm mới"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
