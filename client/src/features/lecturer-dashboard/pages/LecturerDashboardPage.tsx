import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useAuthStore } from "@/store/auth.store";
import { useLecturerClasses } from "../queries/lecturer-dashboard.queries";
import { useMemo } from "react";
import {
  Schedule as ScheduleIcon,
  Class as ClassIcon,
  AccessTime as AccessTimeIcon,
  Room as RoomIcon,
} from "@mui/icons-material";

export const LecturerDashboardPage = () => {
  usePageMeta("Tổng quan giảng viên");
  const user = useAuthStore((state) => state.user);
  const { data: classes, isLoading } = useLecturerClasses();

  const stats = useMemo(() => {
    if (!classes)
      return { totalClasses: 0, todayClassesCount: 0, todaySchedule: [] };

    const today = new Date().getDay(); // 0 (Sunday) to 6 (Saturday)
    // Map Date.getDay() to backend day format
    // Backend: "2" (Mon) to "7" (Sat), "CN" or "8" (Sun)
    let currentDayStr = "";
    if (today === 0) currentDayStr = "CN"; // Check both "CN" and "8" later
    else currentDayStr = (today + 1).toString();

    const todaySchedule: any[] = [];

    classes.forEach((cls) => {
      if (cls.schedule) {
        cls.schedule.forEach((sch: any) => {
          // Check for both "CN" and "8" for Sunday
          const isToday =
            sch.dayOfWeek === currentDayStr ||
            (today === 0 && sch.dayOfWeek === "8");

          if (isToday) {
            todaySchedule.push({
              ...sch,
              className: cls.name,
              subjectCode: cls.subjectCode,
              group: cls.group,
              room: sch.room || cls.room,
            });
          }
        });
      }
    });

    // Sort by start period
    todaySchedule.sort((a, b) => a.startPeriod - b.startPeriod);

    return {
      totalClasses: classes.length,
      todayClassesCount: todaySchedule.length,
      todaySchedule,
    };
  }, [classes]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar
          sx={{
            width: 64,
            height: 64,
            bgcolor: "primary.main",
            fontSize: "2rem",
          }}
        >
          {user?.name?.charAt(0)}
        </Avatar>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Xin chào, {user?.name || "Giảng viên"}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Chúc bạn một ngày làm việc hiệu quả.
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              borderRadius: 3,
              bgcolor: "#ffffff",
              border: "1px solid #fee2e2",
              height: "100%",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(148, 27, 12, 0.06)",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                right: -20,
                top: -40,
                width: 160,
                height: 160,
                borderRadius: "50%",
                bgcolor: "rgba(185, 28, 28, 0.06)",
              }}
            >
              <ClassIcon
                sx={{
                  fontSize: 120,
                  color: "rgba(185, 28, 28, 0.18)",
                  position: "absolute",
                  right: 16,
                  top: 32,
                }}
              />
            </Box>
            <CardContent sx={{ position: "relative" }}>
              <Typography
                variant="h6"
                sx={{ mb: 1, color: "text.secondary", fontWeight: 600 }}
              >
                Lớp học phần
              </Typography>
              <Typography
                variant="h3"
                sx={{ fontWeight: 800, mb: 1, color: "primary.main" }}
              >
                {stats.totalClasses}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Lớp đang phụ trách trong học kỳ này
              </Typography>
              <Chip
                label="Tổng số lớp hiện tại"
                size="small"
                sx={{
                  bgcolor: "#fef2f2",
                  color: "#b91c1c",
                  fontWeight: 600,
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              borderRadius: 3,
              bgcolor: "#ffffff",
              border: "1px solid #fee2e2",
              height: "100%",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(148, 27, 12, 0.06)",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                right: -20,
                top: -40,
                width: 160,
                height: 160,
                borderRadius: "50%",
                bgcolor: "rgba(185, 28, 28, 0.06)",
              }}
            >
              <ScheduleIcon
                sx={{
                  fontSize: 120,
                  color: "rgba(185, 28, 28, 0.18)",
                  position: "absolute",
                  right: 16,
                  top: 32,
                }}
              />
            </Box>
            <CardContent sx={{ position: "relative" }}>
              <Typography
                variant="h6"
                sx={{ mb: 1, color: "text.secondary", fontWeight: 600 }}
              >
                Lịch dạy hôm nay
              </Typography>
              <Typography
                variant="h3"
                sx={{ fontWeight: 800, mb: 1, color: "primary.main" }}
              >
                {stats.todayClassesCount}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Số tiết học cần giảng dạy trong ngày
              </Typography>
              <Chip
                label={
                  stats.todayClassesCount > 0
                    ? "Có lịch dạy trong ngày"
                    : "Hôm nay chưa có lịch dạy"
                }
                size="small"
                sx={{
                  bgcolor:
                    stats.todayClassesCount > 0 ? "#fef2f2" : "#f3f4f6",
                  color:
                    stats.todayClassesCount > 0 ? "#b91c1c" : "text.secondary",
                  fontWeight: 600,
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
        Lịch dạy hôm nay
      </Typography>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: "#f9fafb" }}>
            <TableRow>
              <TableCell>Tiết</TableCell>
              <TableCell>Thời gian</TableCell>
              <TableCell>Môn học</TableCell>
              <TableCell>Lớp/Nhóm</TableCell>
              <TableCell>Phòng</TableCell>
              <TableCell>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stats.todaySchedule.map((item, index) => (
              <TableRow key={index} hover>
                <TableCell sx={{ fontWeight: 600 }}>
                  {item.startPeriod} -{" "}
                  {item.startPeriod + item.numberOfPeriods - 1}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AccessTimeIcon fontSize="small" color="action" />
                    -- : --
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography fontWeight={500}>{item.className}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.subjectCode}
                  </Typography>
                </TableCell>
                <TableCell>Nhóm {item.group}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <RoomIcon fontSize="small" color="action" />
                    <b>{item.room}</b>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label="Sắp diễn ra"
                    color="primary"
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
              </TableRow>
            ))}
            {stats.todaySchedule.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <ScheduleIcon
                      sx={{ fontSize: 40, color: "text.disabled" }}
                    />
                    <Typography color="text.secondary">
                      Hôm nay bạn không có lịch dạy nào.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
