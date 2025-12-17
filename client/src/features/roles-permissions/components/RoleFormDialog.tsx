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

interface RoleFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateRoleRequest) => void;
  initialData?: Role | null;
  isLoading?: boolean;
}

export const RoleFormDialog = ({
  open,
  onClose,
  onSubmit,
  initialData,
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
    if (initialData) {
      reset({
        name: initialData.name,
      });
    } else {
      reset({
        name: "",
      });
    }
  }, [initialData, reset, open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? "Cập nhật vai trò" : "Thêm mới vai trò"}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
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
            {isLoading ? "Đang xử lý..." : initialData ? "Cập nhật" : "Thêm mới"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};


