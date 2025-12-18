import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";
import type { LecturerWithUserData } from "@/features/lecturers/types/lecturer-with-user.types";
import { useGetAllUsers } from "../../users/queries/user.queries";

interface LecturerFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { teacherCode: string; userId: string }) => void;
  initialData?: LecturerWithUserData | null;
  isLoading?: boolean;
}

export const LecturerFormDialog = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: LecturerFormDialogProps) => {
  const { data: users } = useGetAllUsers();

  const availableUsers = Array.isArray(users) ? users : [];

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ teacherCode: string; userId: string }>({
    defaultValues: {
      teacherCode: "",
      userId: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        teacherCode: initialData.teacherCode || "",
        userId: initialData.userId || "",
      });
    } else {
      reset({
        teacherCode: "",
        userId: "",
      });
    }
  }, [initialData, reset, open]);

  const onFormSubmit = (data: { teacherCode: string; userId: string }) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? "Cập nhật giảng viên" : "Thêm mới giảng viên"}
      </DialogTitle>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <Controller
              name="teacherCode"
              control={control}
              rules={{ required: "Mã giảng viên là bắt buộc" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Mã giảng viên"
                  fullWidth
                  error={!!errors.teacherCode}
                  helperText={errors.teacherCode?.message}
                  placeholder="VD: GV001"
                />
              )}
            />

            <Controller
              name="userId"
              control={control}
              rules={{ required: "Người dùng là bắt buộc" }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.userId}>
                  <InputLabel>Người dùng</InputLabel>
                  <Select
                    {...field}
                    label="Người dùng"
                    disabled={!!initialData}
                  >
                    {availableUsers.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.fullName} ({user.email})
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {errors.userId?.message ||
                      (initialData
                        ? "Không thể thay đổi người dùng"
                        : "Chọn người dùng để gán làm giảng viên")}
                  </FormHelperText>
                </FormControl>
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
