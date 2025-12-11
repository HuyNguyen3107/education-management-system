import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Avatar,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useAuthStore } from "@/store/auth.store";
import { useUpdateUser } from "@/features/users/queries/user.queries";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import PersonIcon from "@mui/icons-material/Person";

const GENDER_OPTIONS = [
  { value: "Nam", label: "Nam" },
  { value: "Nữ", label: "Nữ" },
  { value: "Khác", label: "Khác" },
];

export const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const setAuth = useAuthStore((state) => state.setAuth);
  const updateUserMutation = useUpdateUser();
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<{
    email: string;
    fullName: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    address: string;
    academicYear?: string;
    educationLevel?: string;
  }>({
    defaultValues: {
      email: "",
      fullName: "",
      phone: "",
      dateOfBirth: "",
      gender: "",
      address: "",
      academicYear: "",
      educationLevel: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        email: user.email || "",
        fullName: user.fullName || user.name || "",
        phone: user.phone || "",
        dateOfBirth: user.dateOfBirth || "",
        gender: user.gender || "",
        address: user.address || "",
        academicYear: user.academicYear || "",
        educationLevel: user.educationLevel || "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: {
    email: string;
    fullName: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    address: string;
    academicYear?: string;
    educationLevel?: string;
  }) => {
    if (!user?.id) {
      toast.error("Không tìm thấy thông tin người dùng");
      return;
    }

    try {
      setError(null);
      const updatedUser = await updateUserMutation.mutateAsync({
        id: user.id,
        data: {
          email: data.email,
          fullName: data.fullName,
          phone: data.phone,
          dateOfBirth: data.dateOfBirth,
          gender: data.gender,
          address: data.address,
          academicYear: data.academicYear,
          educationLevel: data.educationLevel,
        },
      });

      // Update auth store with new user data
      if (token) {
        setAuth(token, updatedUser);
      }

      toast.success("Cập nhật thông tin thành công");
    } catch (error: any) {
      const msg =
        error.response?.data?.message || "Cập nhật thông tin thất bại";
      setError(msg);
      toast.error(msg);
    }
  };

  const userDisplayName = user?.fullName || user?.name || "User";

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, color: "#111827", mb: 1 }}
          >
            Thông tin cá nhân
          </Typography>
          <Typography variant="body1" sx={{ color: "#6b7280" }}>
            Quản lý và cập nhật thông tin cá nhân của bạn.
          </Typography>
        </Box>
      </Box>

      <Paper
        elevation={0}
        sx={{
          borderRadius: "20px",
          border: "1px solid #f3f4f6",
          overflow: "hidden",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.03)",
          p: 4,
        }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 4 }}>
          <Avatar
            sx={{
              width: 120,
              height: 120,
              bgcolor: "primary.main",
              mb: 2,
              fontSize: "3rem",
            }}
          >
            {userDisplayName.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
            {userDisplayName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
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
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    disabled={updateUserMutation.isPending}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="fullName"
                control={control}
                rules={{ required: "Họ và tên là bắt buộc" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Họ và tên"
                    fullWidth
                    error={!!errors.fullName}
                    helperText={errors.fullName?.message}
                    disabled={updateUserMutation.isPending}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
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
                    disabled={updateUserMutation.isPending}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="dateOfBirth"
                control={control}
                rules={{ required: "Ngày sinh là bắt buộc" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Ngày sinh"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.dateOfBirth}
                    helperText={errors.dateOfBirth?.message}
                    disabled={updateUserMutation.isPending}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="gender"
                control={control}
                rules={{ required: "Giới tính là bắt buộc" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Giới tính"
                    fullWidth
                    error={!!errors.gender}
                    helperText={errors.gender?.message}
                    disabled={updateUserMutation.isPending}
                  >
                    {GENDER_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="academicYear"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Niên khóa"
                    fullWidth
                    placeholder="VD: K2024"
                    disabled={updateUserMutation.isPending}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="educationLevel"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Trình độ học vấn"
                    fullWidth
                    placeholder="VD: Đại học"
                    disabled={updateUserMutation.isPending}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
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
                    rows={3}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                    disabled={updateUserMutation.isPending}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => reset()}
                  disabled={updateUserMutation.isPending || !isDirty}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={updateUserMutation.isPending || !isDirty}
                  sx={{
                    bgcolor: "primary.main",
                    boxShadow:
                      "0 4px 6px -1px rgba(183, 28, 28, 0.4), 0 2px 4px -1px rgba(183, 28, 28, 0.2)",
                    "&:hover": { bgcolor: "primary.dark" },
                  }}
                >
                  {updateUserMutation.isPending ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Đang lưu...
                    </>
                  ) : (
                    "Lưu thay đổi"
                  )}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

