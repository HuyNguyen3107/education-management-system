import {
  Box,
  Card,
  Typography,
  Avatar,
  Divider,
  Chip,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon,
  Cake as CakeIcon,
  School as SchoolIcon,
  Badge as BadgeIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { useLecturerProfile } from "../queries/lecturer-dashboard.queries";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useAuthStore } from "@/store/auth.store";
import { useUpdateUser } from "@/features/users/queries/user.queries";
import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const GENDER_OPTIONS = [
  { value: "Nam", label: "Nam" },
  { value: "Nữ", label: "Nữ" },
  { value: "Khác", label: "Khác" },
];

export const LecturerProfilePage = () => {
  usePageMeta(
    "Thông tin giảng viên",
    "Xem và cập nhật thông tin cá nhân của giảng viên."
  );
  const { data: profile, isLoading: isLoadingProfile } = useLecturerProfile();
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
  }>({
    defaultValues: {
      email: "",
      fullName: "",
      phone: "",
      dateOfBirth: "",
      gender: "",
      address: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        email: user.email || "",
        fullName: (user as any)?.fullName || (user as any)?.name || "",
        phone: (user as any)?.phone || "",
        dateOfBirth: (user as any)?.dateOfBirth || "",
        gender: (user as any)?.gender || "",
        address: (user as any)?.address || "",
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

  if (isLoadingProfile) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const displayName =
    profile?.name ||
    (user as any)?.fullName ||
    (user as any)?.name ||
    "Giảng viên";
  const displayEmail = profile?.email || user?.email || "";
  const displayPhone = profile?.phone || (user as any)?.phone || "";
  const displayAddress = profile?.address || (user as any)?.address || "";
  const displayGender = profile?.gender || (user as any)?.gender || "";
  const displayDateOfBirth =
    profile?.dateOfBirth || (user as any)?.dateOfBirth || "";

  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

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
            Quản lý và cập nhật thông tin cá nhân của giảng viên.
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column - Profile Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: "20px",
              border: "1px solid #f3f4f6",
              overflow: "hidden",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.03)",
              p: 4,
              height: "fit-content",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: "primary.main",
                  mb: 2,
                  fontSize: "3rem",
                }}
              >
                {displayName.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                {displayName}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                {displayEmail}
              </Typography>
              <Chip
                label="Giảng viên"
                color="primary"
                size="small"
                icon={<SchoolIcon />}
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                Thông tin nhanh
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <BadgeIcon fontSize="small" sx={{ color: "#6b7280" }} />
                  <Typography variant="body2" color="text.secondary">
                    MSGV: {profile?.teacherCode || "—"}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <EmailIcon fontSize="small" sx={{ color: "#6b7280" }} />
                  <Typography variant="body2" color="text.secondary">
                    {displayEmail}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PhoneIcon fontSize="small" sx={{ color: "#6b7280" }} />
                  <Typography variant="body2" color="text.secondary">
                    {displayPhone}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CakeIcon fontSize="small" sx={{ color: "#6b7280" }} />
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(displayDateOfBirth)}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PersonIcon fontSize="small" sx={{ color: "#6b7280" }} />
                  <Typography variant="body2" color="text.secondary">
                    {displayGender}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                  <LocationOnIcon
                    fontSize="small"
                    sx={{ color: "#6b7280", mt: 0.2 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {displayAddress}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Right Column - Edit Form */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card
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

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Cập nhật thông tin
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
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

                <Grid size={{ xs: 12, md: 6 }}>
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

                <Grid size={{ xs: 12, md: 6 }}>
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

                <Grid size={{ xs: 12, md: 6 }}>
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

                <Grid size={{ xs: 12, md: 6 }}>
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

                <Grid size={12}>
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

                <Grid size={12}>
                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
                  >
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
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
