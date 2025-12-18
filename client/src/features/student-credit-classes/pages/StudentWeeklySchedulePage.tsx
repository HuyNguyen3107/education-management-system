import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useState, useMemo } from "react";
import { useAuthStore } from "@/store/auth.store";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useWeeklySchedule } from "../queries/student-credit-class.queries";
import { addDays, format, startOfWeek, subDays } from "date-fns";

// Helper to generate periods
const periods = [
  { name: "Tiết 1", time: "07:00" },
  { name: "Tiết 2", time: "08:00" },
  { name: "Tiết 3", time: "09:00" },
  { name: "Tiết 4", time: "10:00" },
  { name: "Tiết 5", time: "11:00" },
  { name: "Tiết 6", time: "12:00" },
  { name: "Tiết 7", time: "13:00" },
  { name: "Tiết 8", time: "14:00" },
  { name: "Tiết 9", time: "15:00" },
  { name: "Tiết 10", time: "16:00" },
  { name: "Tiết 11", time: "17:00" },
  { name: "Tiết 12", time: "18:00" },
  { name: "Tiết 13", time: "19:00" },
  { name: "Tiết 14", time: "20:00" },
  { name: "Tiết 15", time: "21:00" },
  { name: "Tiết 16", time: "22:00" },
  { name: "Tiết 17", time: "23:00" },
];

// Helper to get week days
const getWeekDays = (date: Date) => {
  const start = startOfWeek(date, { weekStartsOn: 1 }); // Monday start
  return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
};

export const StudentWeeklySchedulePage = () => {
  usePageMeta("Thời khóa biểu dạng tuần");
  const { user } = useAuthStore();
  const studentId = user?.id || "";

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSemester, setSelectedSemester] = useState("all");

  const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);

  // Format for API: yyyy-MM-dd
  const startDateStr = format(weekDays[0], "yyyy-MM-dd");
  const endDateStr = format(weekDays[6], "yyyy-MM-dd");

  const { data: scheduleData, isLoading } = useWeeklySchedule(
    studentId,
    startDateStr,
    endDateStr
  );

  const handlePrevWeek = () => setCurrentDate(subDays(currentDate, 7));
  const handleNextWeek = () => setCurrentDate(addDays(currentDate, 7));

  // Process data to map into grid
  // Grid: [Period][DayIndex] -> Class Info
  const scheduleGrid = useMemo(() => {
    if (!scheduleData) return {};

    const grid: Record<string, any> = {};

    scheduleData.forEach((classInfo: any) => {
      if (!classInfo.schedule) return;

      classInfo.schedule.forEach((item: any) => {
        // item: { day: 2, startTime: "07:00", endTime: "09:00", room: "A205" }
        // day: 2 (Monday) -> 8 (Sunday)
        // We map day to index 0-6 (Monday-Sunday)

        // Map day number to index (2->0, 3->1, ..., 8->6)
        // Assuming API returns 2 for Monday, 8 for Sunday (CN)
        let dayIndex = -1;
        if (item.day >= 2 && item.day <= 7) dayIndex = item.day - 2;
        else if (item.day === 8 || item.day === "CN") dayIndex = 6;

        if (dayIndex === -1) return;

        // Determine periods
        // Parse startTime and endTime to find matching periods
        // Simple logic: start hour
        const startHour = parseInt(item.startTime.split(":")[0], 10);
        const endHour = parseInt(item.endTime.split(":")[0], 10);

        // Find periods that fall within this range
        periods.forEach((p, pIndex) => {
          const pHour = parseInt(p.time.split(":")[0], 10);
          // If class covers this period
          // Assuming period starts at p.time. Class covers if startHour <= pHour < endHour
          if (startHour <= pHour && pHour < endHour) {
            const key = `${pIndex}-${dayIndex}`;
            if (!grid[key]) grid[key] = [];
            grid[key].push({
              name: classInfo.name,
              code: classInfo.subjectCode,
              room: item.room,
              group: classInfo.group,
            });
          }
        });
      });
    });

    return grid;
  }, [scheduleData]);

  if (!studentId) return <Alert severity="error">Vui lòng đăng nhập</Alert>;

  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h6"
        color="error"
        gutterBottom
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        <Box component="span" sx={{ fontSize: "1.2rem" }}>
          ⚛
        </Box>{" "}
        THỜI KHÓA BIỂU DẠNG TUẦN
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 2,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <FormControl size="small" sx={{ minWidth: 250 }}>
          <Select
            value={selectedSemester}
            displayEmpty
            onChange={(e) => setSelectedSemester(e.target.value)}
          >
            <MenuItem value="all">Học kỳ 1 - Năm học 2025 - 2026</MenuItem>
            {/* Populate from API if needed */}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 250 }}>
          <Select value="personal" displayEmpty>
            <MenuItem value="personal">Thời khóa biểu cá nhân</MenuItem>
          </Select>
        </FormControl>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 1,
            border: "1px solid #ccc",
            borderRadius: 1,
            p: "4px 8px",
            bgcolor: "#fff",
          }}
        >
          <Typography variant="body2">
            Tuần {format(weekDays[0], "w")} [từ ngày{" "}
            {format(weekDays[0], "dd/MM/yyyy")} đến ngày{" "}
            {format(weekDays[6], "dd/MM/yyyy")}]
          </Typography>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ maxHeight: "80vh" }}>
        <Table
          stickyHeader
          size="small"
          sx={{ "& td, & th": { border: "1px solid #e0e0e0" } }}
        >
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ width: 50, bgcolor: "#f5f5f5" }}>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <IconButton size="small" onClick={handlePrevWeek}>
                    <ArrowBackIcon fontSize="small" />
                  </IconButton>
                </Box>
              </TableCell>
              {weekDays.map((day, index) => (
                <TableCell
                  key={index}
                  align="center"
                  sx={{ bgcolor: "#fff", fontWeight: "bold" }}
                >
                  <Typography variant="body2" fontWeight="bold">
                    {index === 6 ? "Chủ Nhật" : `Thứ ${index + 2}`}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ({format(day, "dd/MM")})
                  </Typography>
                </TableCell>
              ))}
              <TableCell align="center" sx={{ width: 50, bgcolor: "#f5f5f5" }}>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <IconButton size="small" onClick={handleNextWeek}>
                    <ArrowForwardIcon fontSize="small" />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              periods.map((period, pIndex) => (
                <TableRow key={pIndex}>
                  <TableCell
                    sx={{
                      bgcolor: "#B71C1C",
                      color: "#fff",
                      textAlign: "center",
                      fontWeight: "bold",
                      p: 1,
                    }}
                  >
                    {period.name}
                  </TableCell>

                  {weekDays.map((_, dIndex) => {
                    const classes = scheduleGrid[`${pIndex}-${dIndex}`];
                    return (
                      <TableCell
                        key={dIndex}
                        align="center"
                        sx={{ p: 0.5, height: 50, verticalAlign: "top" }}
                      >
                        {classes &&
                          classes.map((c: any, idx: number) => (
                            <Box
                              key={idx}
                              sx={{
                                bgcolor: "#e3f2fd",
                                p: 0.5,
                                borderRadius: 1,
                                mb: 0.5,
                                border: "1px solid #90caf9",
                                fontSize: "0.75rem",
                                textAlign: "left",
                              }}
                            >
                              <Typography
                                variant="caption"
                                display="block"
                                fontWeight="bold"
                                color="primary"
                              >
                                {c.name}
                              </Typography>
                              <Typography variant="caption" display="block">
                                Phòng: {c.room}
                              </Typography>
                              <Typography
                                variant="caption"
                                display="block"
                                sx={{ fontStyle: "italic" }}
                              >
                                {c.code}
                              </Typography>
                            </Box>
                          ))}
                      </TableCell>
                    );
                  })}

                  <TableCell
                    sx={{
                      bgcolor: "#B71C1C",
                      color: "#fff",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {period.time}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
