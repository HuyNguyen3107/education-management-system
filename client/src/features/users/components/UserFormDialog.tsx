import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";
import type { CreateUserRequest, User } from "../types/user.types";

import { USER_STATUS } from "../constants/user-status.constants";

interface UserFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserRequest) => void;
  initialData?: User | null;
  isLoading?: boolean;
}

export const UserFormDialog = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: UserFormDialogProps) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateUserRequest>({
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      phone: "",
      dateOfBirth: "",
      gender: "Nam",
      address: "",
      status: "Studying",
      academicYear: "",
      educationLevel: "",
      role: "STUDENT",
    },
  });

  const watchedRole = watch("role");

  // Define status options
  const STATUS_OPTIONS = USER_STATUS;

  useEffect(() => {
    if (initialData) {
      let inferredRole = initialData.role || "STUDENT";
      // Infer role from status if not provided
      if (!initialData.role && initialData.status) {
        const lecturerStatuses = STATUS_OPTIONS.LECTURER.map((s) => s.value);
        const studentStatuses = STATUS_OPTIONS.STUDENT.map((s) => s.value);

        if (lecturerStatuses.includes(initialData.status)) {
          inferredRole = "LECTURER";
        } else if (studentStatuses.includes(initialData.status)) {
          inferredRole = "STUDENT";
        }
      }

      reset({
        email: initialData.email || "",
        fullName: initialData.fullName || "",
        phone: initialData.phone || "",
        dateOfBirth: initialData.dateOfBirth || "",
        gender: initialData.gender || "Nam",
        address: initialData.address || "",
        status: initialData.status || "Studying",
        academicYear: initialData.academicYear || "",
        educationLevel: initialData.educationLevel || "",
        password: "", // Don't show password
        role: inferredRole,
      });
    } else {
      reset({
        email: "",
        password: "",
        fullName: "",
        phone: "",
        dateOfBirth: "",
        gender: "Nam",
        address: "",
        status: "Studying",
        academicYear: "",
        educationLevel: "",
        role: "STUDENT",
      });
    }
  }, [initialData, reset, open]);

  // Reset status when role changes if not in edit mode (or handle it gracefully)
  // Actually, let's just ensure the status is valid.
  // If user switches role, we might want to default to the first status of that role.
  useEffect(() => {
    const currentStatus = watch("status");
    const currentRole = watch("role") as keyof typeof STATUS_OPTIONS;

    if (currentRole && STATUS_OPTIONS[currentRole]) {
      const isValidStatus = STATUS_OPTIONS[currentRole].some(
        (opt) => opt.value === currentStatus
      );
      if (!isValidStatus) {
        setValue("status", STATUS_OPTIONS[currentRole][0].value);
      }
    }
  }, [watchedRole, setValue]);

  const onFormSubmit = (data: CreateUserRequest) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData ? "Cập nhật người dùng" : "Thêm mới người dùng"}
      </DialogTitle>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <DialogContent>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            <Box>
              <Controller
                name="fullName"
                control={control}
                rules={{ required: "Họ tên là bắt buộc" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Họ và tên"
                    fullWidth
                    error={!!errors.fullName}
                    helperText={errors.fullName?.message}
                  />
                )}
              />
            </Box>
            <Box>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Email là bắt buộc",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email không hợp lệ",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Box>

            <Box>
              <Controller
                name="password"
                control={control}
                rules={{
                  required: !initialData ? "Mật khẩu là bắt buộc" : false,
                  minLength: {
                    value: 6,
                    message: "Mật khẩu phải có ít nhất 6 ký tự",
                  },
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d)/,
                    message: "Mật khẩu phải chứa cả chữ và số",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={
                      initialData
                        ? "Mật khẩu (để trống nếu không đổi)"
                        : "Mật khẩu"
                    }
                    type="password"
                    fullWidth
                    error={!!errors.password}
                    helperText={errors.password?.message}
                  />
                )}
              />
            </Box>

            <Box>
              <Controller
                name="phone"
                control={control}
                rules={{ required: "Số điện thoại là bắt buộc" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Số điện thoại"
                    fullWidth
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                  />
                )}
              />
            </Box>

            <Box>
              <Controller
                name="dateOfBirth"
                control={control}
                rules={{ required: "Ngày sinh là bắt buộc" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Ngày sinh"
                    type="date" // Simple date picker, can be improved
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    error={!!errors.dateOfBirth}
                    helperText={errors.dateOfBirth?.message}
                  />
                )}
              />
            </Box>

            <Box>
              <Controller
                name="gender"
                control={control}
                rules={{ required: "Giới tính là bắt buộc" }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.gender}>
                    <InputLabel>Giới tính</InputLabel>
                    <Select {...field} label="Giới tính">
                      <MenuItem value="Nam">Nam</MenuItem>
                      <MenuItem value="Nữ">Nữ</MenuItem>
                      <MenuItem value="Khác">Khác</MenuItem>
                    </Select>
                    <FormHelperText>{errors.gender?.message}</FormHelperText>
                  </FormControl>
                )}
              />
            </Box>

            <Box sx={{ gridColumn: "1 / -1" }}>
              <Controller
                name="address"
                control={control}
                rules={{ required: "Địa chỉ là bắt buộc" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Địa chỉ"
                    fullWidth
                    multiline
                    rows={2}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                )}
              />
            </Box>

            <Box>
              <Controller
                name="role"
                control={control}
                rules={{ required: "Vai trò là bắt buộc" }}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Loại người dùng</InputLabel>
                    <Select {...field} label="Loại người dùng">
                      <MenuItem value="LECTURER">Giảng viên</MenuItem>
                      <MenuItem value="STUDENT">Sinh viên</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Box>

            <Box>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Trạng thái</InputLabel>
                    <Select {...field} label="Trạng thái">
                      {(
                        STATUS_OPTIONS[
                          watchedRole as keyof typeof STATUS_OPTIONS
                        ] || STATUS_OPTIONS.STUDENT
                      ).map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Box>

            {watchedRole === "STUDENT" && (
              <Box>
                <Controller
                  name="academicYear"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Niên khóa" fullWidth />
                  )}
                />
              </Box>
            )}

            {watchedRole === "STUDENT" && (
              <Box>
                <Controller
                  name="educationLevel"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Trình độ học vấn" fullWidth />
                  )}
                />
              </Box>
            )}
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
