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
import type { StudentWithUserData } from "@/features/students/types/student-with-user.types";
import { useGetAllUsers } from "../../users/queries/user.queries";

interface StudentFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { studentCode: string; userId: string }) => void;
  initialData?: StudentWithUserData | null;
  isLoading?: boolean;
}

export const StudentFormDialog = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: StudentFormDialogProps) => {
  const { data: users } = useGetAllUsers();

  const availableUsers = Array.isArray(users) ? users : [];

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ studentCode: string; userId: string }>({
    defaultValues: {
      studentCode: "",
      userId: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        studentCode: initialData.studentCode || "",
        userId: initialData.userId || "",
      });
    } else {
      reset({
        studentCode: "",
        userId: "",
      });
    }
  }, [initialData, reset, open]);

  const onFormSubmit = (data: { studentCode: string; userId: string }) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? "Cập nhật sinh viên" : "Thêm mới sinh viên"}
      </DialogTitle>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <Controller
              name="studentCode"
              control={control}
              rules={{ required: "Mã sinh viên là bắt buộc" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Mã sinh viên"
                  fullWidth
                  error={!!errors.studentCode}
                  helperText={errors.studentCode?.message}
                  placeholder="VD: SV001"
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
                        : "Chọn người dùng để gán làm sinh viên")}
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
