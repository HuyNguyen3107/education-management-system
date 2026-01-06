import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Avatar,
  MenuItem,
  CircularProgress,
  Alert,
  Grid,
  Chip,
  Divider,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useAuthStore } from "@/store/auth.store";
import { useUpdateUser } from "@/features/users/queries/user.queries";
import { useStudentByUserId } from "@/features/students/queries/student.queries";
import { useLecturerByUserId } from "@/features/lecturers/queries/lecturer.queries";
import {
  useGetAllUserRoles,
  useGetAllRoles,
} from "@/features/users/queries/user.queries";
import { toast } from "react-toastify";
import { useState, useEffect, useMemo } from "react";
import { usePageMeta } from "@/hooks/usePageMeta";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CakeIcon from "@mui/icons-material/Cake";
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

  const { data: studentData, isLoading: isLoadingStudent } = useStudentByUserId(
    user?.id || ""
  );
  const { data: lecturerData, isLoading: isLoadingLecturer } =
    useLecturerByUserId(user?.id || "");
  const { data: allUserRoles } = useGetAllUserRoles();
  const { data: allRoles } = useGetAllRoles();

  usePageMeta(
    "Thông tin cá nhân",
    "Xem và cập nhật thông tin tài khoản người dùng trong hệ thống."
  );

  const userRoles = useMemo(() => {
    if (!allUserRoles || !allRoles || !user) return [];
    return allUserRoles
      .filter((ur) => ur.userId === user.id)
      .map((ur) => {
        const role = allRoles.find((r) => r.id === ur.roleId);
        return role?.name || ur.roleName;
      });
  }, [allUserRoles, allRoles, user]);

  const isStudent = userRoles.includes("STUDENT");
  const isLecturer = userRoles.includes("LECTURER");
  const isAdmin = userRoles.includes("ADMIN");

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
        fullName: (user as any)?.fullName || (user as any)?.name || "",
        phone: (user as any)?.phone || "",
        dateOfBirth: (user as any)?.dateOfBirth || "",
        gender: (user as any)?.gender || "",
        address: (user as any)?.address || "",
        academicYear: (user as any)?.academicYear || "",
        educationLevel: (user as any)?.educationLevel || "",
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

  const userDisplayName =
    (user as any)?.fullName || (user as any)?.name || "User";

  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "STUDENT":
        return <SchoolIcon />;
      case "LECTURER":
        return <WorkIcon />;
      case "ADMIN":
        return <AdminPanelSettingsIcon />;
      default:
        return <PersonIcon />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "STUDENT":
        return "Sinh viên";
      case "LECTURER":
        return "Giảng viên";
      case "ADMIN":
        return "Quản trị viên";
      default:
        return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "STUDENT":
        return "primary";
      case "LECTURER":
        return "secondary";
      case "ADMIN":
        return "error";
      default:
        return "default";
    }
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
            Quản lý và cập nhật thông tin cá nhân của bạn.
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column - Profile Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
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
                {userDisplayName.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                {userDisplayName}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                {user?.email}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  justifyContent: "center",
                }}
              >
                {userRoles.map((role) => (
                  <Chip
                    key={role}
                    icon={getRoleIcon(role)}
                    label={getRoleLabel(role)}
                    size="small"
                    color={getRoleColor(role) as any}
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                Thông tin nhanh
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <EmailIcon fontSize="small" sx={{ color: "#6b7280" }} />
                  <Typography variant="body2" color="text.secondary">
                    {user?.email}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PhoneIcon fontSize="small" sx={{ color: "#6b7280" }} />
                  <Typography variant="body2" color="text.secondary">
                    {(user as any)?.phone || "—"}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CakeIcon fontSize="small" sx={{ color: "#6b7280" }} />
                  <Typography variant="body2" color="text.secondary">
                    {formatDate((user as any)?.dateOfBirth)}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PersonIcon fontSize="small" sx={{ color: "#6b7280" }} />
                  <Typography variant="body2" color="text.secondary">
                    {(user as any)?.gender || "—"}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                  <LocationOnIcon
                    fontSize="small"
                    sx={{ color: "#6b7280", mt: 0.2 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {(user as any)?.address || "—"}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Student Specific Info */}
            {isStudent && (
              <>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, mb: 2 }}
                  >
                    Thông tin sinh viên
                  </Typography>
                  {isLoadingStudent ? (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", py: 2 }}
                    >
                      <CircularProgress size={20} />
                    </Box>
                  ) : studentData ? (
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <SchoolIcon
                          fontSize="small"
                          sx={{ color: "#6b7280" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          MSSV: {studentData.studentCode}
                        </Typography>
                      </Box>
                      {(user as any)?.academicYear && (
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <CalendarTodayIcon
                            fontSize="small"
                            sx={{ color: "#6b7280" }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            Niên khóa: {(user as any)?.academicYear}
                          </Typography>
                        </Box>
                      )}
                      {(user as any)?.educationLevel && (
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <WorkIcon
                            fontSize="small"
                            sx={{ color: "#6b7280" }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            Trình độ: {(user as any)?.educationLevel}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Không tìm thấy thông tin sinh viên
                    </Typography>
                  )}
                </Box>
              </>
            )}

            {/* Lecturer Specific Info */}
            {isLecturer && (
              <>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, mb: 2 }}
                  >
                    Thông tin giảng viên
                  </Typography>
                  {isLoadingLecturer ? (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", py: 2 }}
                    >
                      <CircularProgress size={20} />
                    </Box>
                  ) : lecturerData ? (
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <WorkIcon fontSize="small" sx={{ color: "#6b7280" }} />
                        <Typography variant="body2" color="text.secondary">
                          MSGV: {lecturerData.teacherCode}
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Không tìm thấy thông tin giảng viên
                    </Typography>
                  )}
                </Box>
              </>
            )}

            {/* Admin Info */}
            {isAdmin && !isStudent && !isLecturer && (
              <>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, mb: 2 }}
                  >
                    Thông tin quản trị viên
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AdminPanelSettingsIcon
                      fontSize="small"
                      sx={{ color: "#6b7280" }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Quản trị viên hệ thống
                    </Typography>
                  </Box>
                </Box>
              </>
            )}
          </Paper>
        </Grid>

        {/* Right Column - Edit Form */}
        <Grid size={{ xs: 12, md: 8 }}>
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

                {isStudent && (
                  <>
                    <Grid size={{ xs: 12, md: 6 }}>
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

                    <Grid size={{ xs: 12, md: 6 }}>
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
                  </>
                )}

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
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
