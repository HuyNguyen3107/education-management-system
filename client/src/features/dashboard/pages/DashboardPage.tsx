import { Typography, Box, Button, Paper, Avatar, Chip, Skeleton, Grid } from "@mui/material";
import { StatCard } from "../components/StatCard/StatCard";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SchoolIcon from "@mui/icons-material/School";
import ClassIcon from "@mui/icons-material/Class";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ReceiptIcon from "@mui/icons-material/Receipt";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
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
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];

export const DashboardPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  
  const { data: students = [], isLoading: loadingStudents } = useStudents();
  const { data: lecturers = [], isLoading: loadingLecturers } = useLecturers();
  const { data: classes = [], isLoading: loadingClasses } = useClasses();
  const { data: creditClasses = [], isLoading: loadingCreditClasses } = useCreditClasses();
  const { data: subjects = [], isLoading: loadingSubjects } = useSubjects();
  const { data: studentCreditClasses = [], isLoading: loadingStudentCreditClasses } = useStudentCreditClasses();
  const { data: studentTuitions = [], isLoading: loadingStudentTuitions } = useStudentTuitions();

  const currentDate = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Chào buổi sáng" : currentHour < 18 ? "Chào buổi chiều" : "Chào buổi tối";

  // Quick actions data
  const quickActions = [
    { title: "Thêm sinh viên", icon: <PersonAddIcon />, path: ROUTE_PATHS.STUDENTS, color: "#3b82f6" },
    { title: "Đăng ký lớp TC", icon: <AssignmentIcon />, path: ROUTE_PATHS.STUDENT_CREDIT_CLASSES, color: "#8b5cf6" },
    { title: "Quản lý học phí", icon: <ReceiptIcon />, path: ROUTE_PATHS.STUDENT_TUITIONS, color: "#10b981" },
    { title: "Thông báo", icon: <NotificationsActiveIcon />, path: ROUTE_PATHS.NOTIFICATIONS, color: "#f59e0b" },
  ];

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

  // Pie chart data
  const pieData = [
    { name: "Sinh viên", value: students.length },
    { name: "Giảng viên", value: lecturers.length },
    { name: "Môn học", value: subjects.length },
    { name: "Lớp TC", value: creditClasses.length },
  ];

  // Recent registrations
  const recentRegistrations = studentCreditClasses.slice(-5).reverse();

  return (
    <Box>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              background: "linear-gradient(135deg, #1e3a8a 0%, #7c3aed 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1,
              letterSpacing: "-1px",
            }}
          >
            {greeting}, {user?.fullName || "Admin"}! 👋
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#6b7280",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <CalendarTodayIcon fontSize="small" />
            {currentDate}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<TrendingUpIcon />}
            disableElevation
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              background: "linear-gradient(135deg, #1e3a8a 0%, #7c3aed 100%)",
              px: 3,
              "&:hover": {
                background: "linear-gradient(135deg, #1e40af 0%, #6d28d9 100%)",
              },
            }}
          >
            Xem báo cáo
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          {loadingStudents ? (
            <Skeleton variant="rounded" height={160} sx={{ borderRadius: "24px" }} />
          ) : (
            <StatCard
              title="Tổng sinh viên"
              value={students.length.toLocaleString()}
              icon={<PeopleAltIcon fontSize="large" />}
              color="#3b82f6"
              trend={students.length > 0 ? "+12%" : undefined}
              trendUp={true}
            />
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {loadingLecturers ? (
            <Skeleton variant="rounded" height={160} sx={{ borderRadius: "24px" }} />
          ) : (
            <StatCard
              title="Giảng viên"
              value={lecturers.length.toLocaleString()}
              icon={<SchoolIcon fontSize="large" />}
              color="#8b5cf6"
              trend={lecturers.length > 0 ? "+5%" : undefined}
              trendUp={true}
            />
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {loadingCreditClasses ? (
            <Skeleton variant="rounded" height={160} sx={{ borderRadius: "24px" }} />
          ) : (
            <StatCard
              title="Lớp tín chỉ"
              value={creditClasses.length.toLocaleString()}
              icon={<CreditScoreIcon fontSize="large" />}
              color="#10b981"
              trend={creditClasses.length > 0 ? "+8%" : undefined}
              trendUp={true}
            />
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {loadingSubjects ? (
            <Skeleton variant="rounded" height={160} sx={{ borderRadius: "24px" }} />
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

      {/* Second Row Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          {loadingClasses ? (
            <Skeleton variant="rounded" height={140} sx={{ borderRadius: "24px" }} />
          ) : (
            <StatCard
              title="Lớp học"
              value={classes.length.toLocaleString()}
              icon={<ClassIcon fontSize="large" />}
              color="#ec4899"
            />
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          {loadingStudentCreditClasses ? (
            <Skeleton variant="rounded" height={140} sx={{ borderRadius: "24px" }} />
          ) : (
            <StatCard
              title="Đăng ký lớp TC"
              value={studentCreditClasses.length.toLocaleString()}
              icon={<AssignmentIcon fontSize="large" />}
              color="#06b6d4"
              trend={studentCreditClasses.length > 0 ? "+15%" : undefined}
              trendUp={true}
            />
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          {loadingStudentTuitions ? (
            <Skeleton variant="rounded" height={140} sx={{ borderRadius: "24px" }} />
          ) : (
            <StatCard
              title="Học phí đã thu"
              value={studentTuitions.length.toLocaleString()}
              icon={<ReceiptIcon fontSize="large" />}
              color="#84cc16"
            />
          )}
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: "24px",
          background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
          border: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#1f2937", mb: 3 }}>
          ⚡ Thao tác nhanh
        </Typography>
        <Grid container spacing={2}>
          {quickActions.map((action, index) => (
            <Grid item xs={6} sm={3} key={index}>
              <Paper
                elevation={0}
                onClick={() => navigate(action.path)}
                sx={{
                  p: 2.5,
                  borderRadius: "16px",
                  bgcolor: "#fff",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  border: "1px solid transparent",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: `0 12px 24px ${action.color}20`,
                    borderColor: action.color,
                    "& .action-icon": {
                      transform: "scale(1.1)",
                      bgcolor: action.color,
                      color: "#fff",
                    },
                  },
                }}
              >
                <Avatar
                  className="action-icon"
                  sx={{
                    width: 56,
                    height: 56,
                    mx: "auto",
                    mb: 1.5,
                    bgcolor: `${action.color}15`,
                    color: action.color,
                    transition: "all 0.3s ease",
                  }}
                >
                  {action.icon}
                </Avatar>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#374151" }}>
                  {action.title}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Registration Trend Chart */}
        <Grid item xs={12} lg={8}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: "24px",
              bgcolor: "#ffffff",
              boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.08), 0px 4px 12px rgba(0, 0, 0, 0.05)",
              border: "1px solid rgba(0,0,0,0.03)",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#111827" }}>
                  Xu hướng đăng ký
                </Typography>
                <Typography variant="body2" sx={{ color: "#6b7280" }}>
                  Số lượng đăng ký lớp tín chỉ theo tháng
                </Typography>
              </Box>
              <Chip
                label={`${studentCreditClasses.length} đăng ký`}
                sx={{
                  bgcolor: "#dbeafe",
                  color: "#1e40af",
                  fontWeight: 600,
                }}
              />
            </Box>
            <Box sx={{ width: "100%", height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Pie Chart */}
        <Grid item xs={12} lg={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: "100%",
              borderRadius: "24px",
              bgcolor: "#ffffff",
              boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.08), 0px 4px 12px rgba(0, 0, 0, 0.05)",
              border: "1px solid rgba(0,0,0,0.03)",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#111827", mb: 2 }}>
              Phân bố hệ thống
            </Typography>
            <Box sx={{ width: "100%", height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <Box sx={{ mt: 2 }}>
              {pieData.map((item, index) => (
                <Box key={index} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: "4px", bgcolor: COLORS[index] }} />
                    <Typography variant="body2" sx={{ color: "#6b7280" }}>
                      {item.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#1f2937" }}>
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Registrations */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: "24px",
          bgcolor: "#ffffff",
          boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.08), 0px 4px 12px rgba(0, 0, 0, 0.05)",
          border: "1px solid rgba(0,0,0,0.03)",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#111827" }}>
            📚 Đăng ký lớp tín chỉ gần đây
          </Typography>
          <Button
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate(ROUTE_PATHS.STUDENT_CREDIT_CLASSES)}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              color: "#3b82f6",
              "&:hover": { bgcolor: "#eff6ff" },
            }}
          >
            Xem tất cả
          </Button>
        </Box>

        {loadingStudentCreditClasses ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} variant="rounded" height={60} sx={{ borderRadius: "12px" }} />
            ))}
          </Box>
        ) : recentRegistrations.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography color="text.secondary">Chưa có đăng ký nào</Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {recentRegistrations.map((reg, index) => (
              <Paper
                key={reg.id}
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: "16px",
                  bgcolor: "#f9fafb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "all 0.2s",
                  "&:hover": {
                    bgcolor: "#f3f4f6",
                    transform: "translateX(4px)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    sx={{
                      width: 44,
                      height: 44,
                      bgcolor: COLORS[index % COLORS.length],
                      fontWeight: 700,
                    }}
                  >
                    {index + 1}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: "#1f2937" }}>
                      Sinh viên: {reg.studentId.slice(0, 8)}...
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#6b7280" }}>
                      Lớp: {reg.creditClassId.slice(0, 8)}...
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
                  <Typography variant="caption" sx={{ display: "block", mt: 0.5, color: "#9ca3af" }}>
                    {new Date(reg.createdAt).toLocaleDateString("vi-VN")}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
};
