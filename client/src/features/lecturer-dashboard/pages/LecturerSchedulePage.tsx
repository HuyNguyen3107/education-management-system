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
  Chip,
  Tabs,
  Tab,
  CircularProgress,
} from "@mui/material";
import { useLecturerSchedule } from "../queries/lecturer-dashboard.queries";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useMemo, useState } from "react";
import {
  AccessTime as AccessTimeIcon,
  Room as RoomIcon,
} from "@mui/icons-material";

export const LecturerSchedulePage = () => {
  usePageMeta("Lịch dạy");
  const { data: classes, isLoading } = useLecturerSchedule();
  const [selectedDay, setSelectedDay] = useState("ALL");

  const scheduleData = useMemo(() => {
    if (!classes) return [];

    // Flatten the schedule: One row per schedule item per class
    interface FlatScheduleItem {
      className: string;
      subjectCode: string;
      group: string;
      room: string;
      dayOfWeek: string;
      startPeriod: number;
      numberOfPeriods: number;
      startDate: string;
      endDate: string;
    }

    const items: FlatScheduleItem[] = [];
    classes.forEach((cls) => {
      if (cls.schedule && cls.schedule.length > 0) {
        cls.schedule.forEach((sch) => {
          items.push({
            ...sch,
            className: cls.name,
            subjectCode: cls.subjectCode,
            group: cls.group,
            room: sch.room || cls.room,
          });
        });
      }
    });

    // Sort by Day of Week then Start Period
    const dayMap: Record<string, number> = {
      "2": 2,
      "3": 3,
      "4": 4,
      "5": 5,
      "6": 6,
      "7": 7,
      CN: 8,
      "8": 8,
    };

    return items.sort((a, b) => {
      const dayA = dayMap[a.dayOfWeek] || 99;
      const dayB = dayMap[b.dayOfWeek] || 99;
      if (dayA !== dayB) return dayA - dayB;
      return a.startPeriod - b.startPeriod;
    });
  }, [classes]);

  const filteredDataRobust = useMemo(() => {
    if (selectedDay === "ALL") return scheduleData;
    if (selectedDay === "CN")
      return scheduleData.filter(
        (item) => item.dayOfWeek === "CN" || item.dayOfWeek === "8"
      );
    return scheduleData.filter((item) => item.dayOfWeek === selectedDay);
  }, [scheduleData, selectedDay]);

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setSelectedDay(newValue);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const days = [
    { value: "ALL", label: "Tất cả" },
    { value: "2", label: "Thứ 2" },
    { value: "3", label: "Thứ 3" },
    { value: "4", label: "Thứ 4" },
    { value: "5", label: "Thứ 5" },
    { value: "6", label: "Thứ 6" },
    { value: "7", label: "Thứ 7" },
    { value: "CN", label: "Chủ nhật" },
  ];

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
        Lịch giảng dạy
      </Typography>

      <Paper sx={{ mb: 3 }} elevation={0} variant="outlined">
        <Tabs
          value={selectedDay}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          indicatorColor="primary"
          textColor="primary"
          sx={{ px: 2 }}
        >
          {days.map((day) => (
            <Tab key={day.value} value={day.value} label={day.label} />
          ))}
        </Tabs>
      </Paper>

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
              <TableCell>Thứ</TableCell>
              <TableCell>Tiết</TableCell>
              <TableCell>Môn học</TableCell>
              <TableCell>Nhóm</TableCell>
              <TableCell>Phòng</TableCell>
              <TableCell>Thời gian</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDataRobust.map((item, index) => (
              <TableRow key={index} hover>
                <TableCell>
                  <Chip
                    label={
                      item.dayOfWeek === "CN" || item.dayOfWeek === "8"
                        ? "Chủ nhật"
                        : `Thứ ${item.dayOfWeek}`
                    }
                    color={
                      item.dayOfWeek === "CN" || item.dayOfWeek === "8"
                        ? "error"
                        : "primary"
                    }
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AccessTimeIcon fontSize="small" color="action" />
                    {item.startPeriod} -{" "}
                    {item.startPeriod + item.numberOfPeriods - 1}
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 500 }}>
                  {item.className}
                  <Typography
                    variant="caption"
                    display="block"
                    color="text.secondary"
                  >
                    {item.subjectCode}
                  </Typography>
                </TableCell>
                <TableCell>{item.group}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <RoomIcon fontSize="small" color="action" />
                    <b>{item.room}</b>
                  </Box>
                </TableCell>
                <TableCell>
                  {item.startDate} - {item.endDate}
                </TableCell>
              </TableRow>
            ))}
            {filteredDataRobust.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  Không có lịch dạy cho ngày này.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
