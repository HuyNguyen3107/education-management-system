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
  Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import type { CreateUserRequest, User, Role } from "../types/user.types";
import type { Major } from "../../majors/types/major.types";

import { USER_STATUS } from "../constants/user-status.constants";
import { useGetAllRoles } from "../queries/user.queries";
import { useMajors } from "../../majors/queries/major.queries";
import {
  generateStudentCode,
  generateLecturerCode,
  validateAcademicYear,
} from "../utils/id-generator.utils";

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
  const { data: roles } = useGetAllRoles();
  const { data: majorsData } = useMajors();
  const majors = Array.isArray(majorsData)
    ? majorsData
    : majorsData?.content || [];

  const [generatedCode, setGeneratedCode] = useState<string>("");

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
      roleId: "",
      majorId: "",
    },
  });

  const watchedRole = watch("role");
  const watchedAcademicYear = watch("academicYear");
  const watchedMajorId = watch("majorId");

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
        roleId: "",
        majorId: initialData.majorId || "",
      });
      setGeneratedCode(""); // Clear generated code for edit mode
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
        roleId: "",
        majorId: "",
      });
      setGeneratedCode(""); // Clear generated code for new user
    }
  }, [initialData, reset, open]);

  // Reset status when role changes if not in edit mode (or handle it gracefully)
  // Actually, let's just ensure the status is valid.
  // If user switches role, we might want to default to the first status of that role.
  useEffect(() => {
    const currentStatus = watch("status");
    const currentRole = watchedRole as keyof typeof STATUS_OPTIONS;

    if (currentRole && STATUS_OPTIONS[currentRole]) {
      const isValidStatus = STATUS_OPTIONS[currentRole].some(
        (opt) => opt.value === currentStatus
      );
      if (!isValidStatus) {
        setValue("status", STATUS_OPTIONS[currentRole][0].value);
      }
    }
  }, [watchedRole, setValue, watch]);

  // Auto-generate code when role, academic year, or major changes
  useEffect(() => {
    if (!initialData) {
      // Only generate code for new users
      const selectedMajor = majors.find((m: Major) => m.id === watchedMajorId);

      if (
        watchedRole === "STUDENT" &&
        selectedMajor &&
        watchedAcademicYear &&
        validateAcademicYear(watchedAcademicYear)
      ) {
        // Generate student code: B + year + major + sequence (default to 1 for preview)
        const code = generateStudentCode(
          watchedAcademicYear,
          selectedMajor.name,
          1
        );
        setGeneratedCode(code);
      } else if (watchedRole === "LECTURER" && selectedMajor) {
        // Generate lecturer code: G + year + major + sequence (default to 1 for preview)
        const code = generateLecturerCode(selectedMajor.name, 1);
        setGeneratedCode(code);
      } else {
        setGeneratedCode("");
      }
    }
  }, [watchedRole, watchedAcademicYear, watchedMajorId, majors, initialData]);

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
                    value: 8,
                    message: "Mật khẩu phải có ít nhất 8 ký tự",
                  },
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/,
                    message:
                      "Mật khẩu phải chứa ít nhất 1 chữ thường, 1 chữ hoa, 1 số và 1 ký tự đặc biệt",
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
                rules={{
                  required: "Số điện thoại là bắt buộc",
                  pattern: {
                    value: /^[0-9]{10,11}$/,
                    message: "Số điện thoại phải có 10-11 chữ số",
                  },
                }}
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
                  <FormControl fullWidth error={!!errors.role}>
                    <InputLabel>Loại người dùng</InputLabel>
                    <Select {...field} label="Loại người dùng">
                      <MenuItem value="LECTURER">Giảng viên</MenuItem>
                      <MenuItem value="STUDENT">Sinh viên</MenuItem>
                    </Select>
                    <FormHelperText>{errors.role?.message}</FormHelperText>
                  </FormControl>
                )}
              />
            </Box>

            <Box>
              <Controller
                name="status"
                control={control}
                rules={{ required: "Trạng thái là bắt buộc" }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.status}>
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
                    <FormHelperText>{errors.status?.message}</FormHelperText>
                  </FormControl>
                )}
              />
            </Box>

            {!initialData && (
              <Box sx={{ gridColumn: "1 / -1" }}>
                <Controller
                  name="roleId"
                  control={control}
                  rules={{
                    required: "Vai trò hệ thống là bắt buộc",
                  }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.roleId}>
                      <InputLabel>Vai trò hệ thống</InputLabel>
                      <Select {...field} label="Vai trò hệ thống">
                        {roles && roles.length > 0 ? (
                          roles.map((role: Role) => (
                            <MenuItem key={role.id} value={role.id}>
                              {role.name}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled value="">
                            Chưa có vai trò nào
                          </MenuItem>
                        )}
                      </Select>
                      <FormHelperText>{errors.roleId?.message}</FormHelperText>
                    </FormControl>
                  )}
                />
              </Box>
            )}

            {(watchedRole === "STUDENT" || watchedRole === "LECTURER") && (
              <Box>
                <Controller
                  name="majorId"
                  control={control}
                  rules={{ required: "Ngành học là bắt buộc" }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.majorId}>
                      <InputLabel>Ngành học</InputLabel>
                      <Select {...field} label="Ngành học">
                        {majors && majors.length > 0 ? (
                          majors.map((major: Major) => (
                            <MenuItem key={major.id} value={major.id}>
                              {major.name}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled value="">
                            Chưa có ngành nào
                          </MenuItem>
                        )}
                      </Select>
                      <FormHelperText>{errors.majorId?.message}</FormHelperText>
                    </FormControl>
                  )}
                />
              </Box>
            )}

            {watchedRole === "STUDENT" && (
              <Box>
                <Controller
                  name="academicYear"
                  control={control}
                  rules={{
                    required: "Niên khóa là bắt buộc",
                    pattern: {
                      value: /^\d{4}-\d{4}$/,
                      message:
                        "Niên khóa phải theo định dạng YYYY-YYYY (ví dụ: 2021-2026)",
                    },
                    validate: (value) => {
                      if (!value) return true;
                      const currentYear = new Date().getFullYear();
                      const startYear = parseInt(value.split("-")[0]);
                      const endYear = parseInt(value.split("-")[1]);

                      if (startYear !== currentYear) {
                        return `Năm bắt đầu phải là năm hiện tại (${currentYear})`;
                      }
                      if (endYear <= startYear) {
                        return "Năm kết thúc phải lớn hơn năm bắt đầu";
                      }
                      return true;
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Niên khóa"
                      placeholder="Ví dụ: 2026-2030"
                      fullWidth
                      error={!!errors.academicYear}
                      helperText={errors.academicYear?.message}
                    />
                  )}
                />
              </Box>
            )}

            {watchedRole === "STUDENT" && (
              <Box>
                <Controller
                  name="educationLevel"
                  control={control}
                  rules={{ required: "Trình độ học vấn là bắt buộc" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Trình độ học vấn"
                      fullWidth
                      error={!!errors.educationLevel}
                      helperText={errors.educationLevel?.message}
                    />
                  )}
                />
              </Box>
            )}

            {!initialData && generatedCode && (
              <Box sx={{ gridColumn: "1 / -1" }}>
                <TextField
                  label="Mã sinh viên/giảng viên (Tự động tạo)"
                  value={generatedCode}
                  fullWidth
                  disabled
                  helperText="Mã sẽ được tạo tự động dựa trên ngành và niên khóa"
                  InputProps={{
                    sx: {
                      backgroundColor: "#f3f4f6",
                      fontWeight: "bold",
                    },
                  }}
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
