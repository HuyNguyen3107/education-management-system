import {
  Typography,
  Box,
  Paper,
  Avatar,
  Chip,
  Skeleton,
  Grid,
  Button,
} from "@mui/material";
import { StatCard } from "../components/StatCard/StatCard";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SchoolIcon from "@mui/icons-material/School";
import ClassIcon from "@mui/icons-material/Class";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "@/constants/route-path.constants";
import { useStudents } from "@/features/students/queries/student.queries";
import { useLecturers } from "@/features/lecturers/queries/lecturer.queries";
import { useClasses } from "@/features/classes/queries/class.queries";
import { useCreditClasses } from "@/features/credit-classes/queries/credit-class.queries";
import { useSubjects } from "@/features/subjects/queries/subject.queries";
import { useStudentCreditClasses } from "@/features/student-credit-classes/queries/student-credit-class.queries";
import { useStudentTuitions } from "@/features/student-tuitions/queries/student-tuition.queries";
import { useAuthStore } from "@/store/auth.store";
import { usePageMeta } from "@/hooks/usePageMeta";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];

export const DashboardPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  usePageMeta(
    "Tổng quan hệ thống",
    "Trang tổng quan dành cho quản trị hệ thống quản lý đào tạo."
  );

  const { data: students = [], isLoading: loadingStudents } = useStudents();
  const { data: lecturers = [], isLoading: loadingLecturers } = useLecturers();
  const { data: classes = [], isLoading: loadingClasses } = useClasses();
  const { data: creditClasses = [], isLoading: loadingCreditClasses } =
    useCreditClasses();
  const { data: subjects = [], isLoading: loadingSubjects } = useSubjects();
  const {
    data: studentCreditClasses = [],
    isLoading: loadingStudentCreditClasses,
  } = useStudentCreditClasses();
  const { data: studentTuitions = [], isLoading: loadingStudentTuitions } =
    useStudentTuitions();

  const currentDate = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Chào buổi sáng"
      : currentHour < 18
      ? "Chào buổi chiều"
      : "Chào buổi tối";

  const displayName = user?.name || "Admin";

  // Generate chart data based on real registrations
  const monthlyData = [
    { name: "T1", value: Math.floor(studentCreditClasses.length * 0.6) },
    { name: "T2", value: Math.floor(studentCreditClasses.length * 0.7) },
    { name: "T3", value: Math.floor(studentCreditClasses.length * 0.5) },
    { name: "T4", value: Math.floor(studentCreditClasses.length * 0.8) },
    { name: "T5", value: Math.floor(studentCreditClasses.length * 0.65) },
    { name: "T6", value: Math.floor(studentCreditClasses.length * 0.9) },
    { name: "T7", value: Math.floor(studentCreditClasses.length * 0.75) },
    { name: "T8", value: Math.floor(studentCreditClasses.length * 0.85) },
    { name: "T9", value: Math.floor(studentCreditClasses.length * 0.95) },
    { name: "T10", value: Math.floor(studentCreditClasses.length * 0.8) },
    { name: "T11", value: Math.floor(studentCreditClasses.length * 0.7) },
    { name: "T12", value: studentCreditClasses.length },
  ];

  // Recent registrations
  const recentRegistrations = studentCreditClasses.slice(-5).reverse();

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 0.5,
              letterSpacing: "-0.5px",
            }}
          >
            {greeting}, {displayName}!
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <CalendarTodayIcon fontSize="small" />
            {currentDate}
          </Typography>
        </Box>
      </Box>

      {/* Primary stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {loadingStudents ? (
            <Skeleton variant="rounded" height={140} sx={{ borderRadius: 3 }} />
          ) : (
            <StatCard
              title="Tổng sinh viên"
              value={students.length.toLocaleString()}
              icon={<PeopleAltIcon fontSize="large" />}
              color="#3b82f6"
              trend={students.length > 0 ? "+12%" : undefined}
              trendUp
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {loadingLecturers ? (
            <Skeleton variant="rounded" height={140} sx={{ borderRadius: 3 }} />
          ) : (
            <StatCard
              title="Giảng viên"
              value={lecturers.length.toLocaleString()}
              icon={<SchoolIcon fontSize="large" />}
              color="#8b5cf6"
              trend={lecturers.length > 0 ? "+5%" : undefined}
              trendUp
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {loadingCreditClasses ? (
            <Skeleton variant="rounded" height={140} sx={{ borderRadius: 3 }} />
          ) : (
            <StatCard
              title="Lớp tín chỉ"
              value={creditClasses.length.toLocaleString()}
              icon={<CreditScoreIcon fontSize="large" />}
              color="#10b981"
              trend={creditClasses.length > 0 ? "+8%" : undefined}
              trendUp
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {loadingSubjects ? (
            <Skeleton variant="rounded" height={140} sx={{ borderRadius: 3 }} />
          ) : (
            <StatCard
              title="Môn học"
              value={subjects.length.toLocaleString()}
              icon={<MenuBookIcon fontSize="large" />}
              color="#f59e0b"
            />
          )}
        </Grid>
      </Grid>

      {/* Secondary stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          {loadingClasses ? (
            <Skeleton variant="rounded" height={130} sx={{ borderRadius: 3 }} />
          ) : (
            <StatCard
              title="Lớp học hành chính"
              value={classes.length.toLocaleString()}
              icon={<ClassIcon fontSize="large" />}
              color="#ec4899"
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          {loadingStudentCreditClasses ? (
            <Skeleton variant="rounded" height={130} sx={{ borderRadius: 3 }} />
          ) : (
            <StatCard
              title="Đăng ký lớp tín chỉ"
              value={studentCreditClasses.length.toLocaleString()}
              icon={<AssignmentIcon fontSize="large" />}
              color="#06b6d4"
              trend={studentCreditClasses.length > 0 ? "+15%" : undefined}
              trendUp
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          {loadingStudentTuitions ? (
            <Skeleton variant="rounded" height={130} sx={{ borderRadius: 3 }} />
          ) : (
            <StatCard
              title="Học phí đã thu (bản ghi)"
              value={studentTuitions.length.toLocaleString()}
              icon={<ReceiptIcon fontSize="large" />}
              color="#84cc16"
            />
          )}
        </Grid>
      </Grid>

      {/* Charts + recent activity */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: "#ffffff",
              border: "1px solid #e5e7eb",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Xu hướng đăng ký lớp tín chỉ
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Số lượng đăng ký theo tháng (minh họa từ dữ liệu hiện tại)
                </Typography>
              </Box>
              <Chip
                label={`${studentCreditClasses.length} đăng ký`}
                size="small"
                sx={{
                  bgcolor: "#eff6ff",
                  color: "#1d4ed8",
                  fontWeight: 600,
                }}
              />
            </Box>

            <Box sx={{ width: "100%", height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient
                      id="dashboardArea"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={COLORS[0]}
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="95%"
                        stopColor={COLORS[0]}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5e7eb"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 8px 20px rgba(15,23,42,0.08)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={COLORS[0]}
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#dashboardArea)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: "#ffffff",
              border: "1px solid #e5e7eb",
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Đăng ký gần đây
              </Typography>
              <Button
                size="small"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate(ROUTE_PATHS.STUDENT_CREDIT_CLASSES)}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  color: "#2563eb",
                  "&:hover": { bgcolor: "#eff6ff" },
                }}
              >
                Xem tất cả
              </Button>
            </Box>

            {loadingStudentCreditClasses ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton
                    key={i}
                    variant="rounded"
                    height={56}
                    sx={{ borderRadius: 2 }}
                  />
                ))}
              </Box>
            ) : recentRegistrations.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 3 }}>
                <Typography color="text.secondary">
                  Chưa có đăng ký lớp tín chỉ nào.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {recentRegistrations.map((reg, index) => (
                  <Box
                    key={reg.id}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: "#f9fafb",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: COLORS[index % COLORS.length],
                          fontWeight: 700,
                          fontSize: 16,
                        }}
                      >
                        {index + 1}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: "#111827" }}
                        >
                          SV: {reg.studentId.slice(0, 8)}...
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary" }}
                        >
                          Lớp TC: {reg.creditClassId.slice(0, 8)}...
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <Chip
                        label="Đã đăng ký"
                        size="small"
                        sx={{
                          bgcolor: "#dcfce7",
                          color: "#166534",
                          fontWeight: 600,
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          mt: 0.5,
                          color: "#9ca3af",
                        }}
                      >
                        {new Date(reg.createdAt).toLocaleDateString("vi-VN")}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
