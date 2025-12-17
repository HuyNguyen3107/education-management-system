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
} from "@mui/material";
import { useLecturerSchedule } from "../queries/lecturer-dashboard.queries";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useMemo } from "react";

export const LecturerSchedulePage = () => {
  usePageMeta("Lịch dạy");
  const { data: classes, isLoading } = useLecturerSchedule();

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
            room: sch.room || cls.room, // Use specific room if avail, else class room
          });
        });
      }
    });

    // Sort by Day of Week then Start Period
    // dayOfWeek map: "2" -> 2, "CN" -> 8
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

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
        Lịch giảng dạy
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
              <TableCell>Thứ</TableCell>
              <TableCell>Tiết</TableCell>
              <TableCell>Môn học</TableCell>
              <TableCell>Nhóm</TableCell>
              <TableCell>Phòng</TableCell>
              <TableCell>Thời gian</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scheduleData.map((item, index) => (
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
                  {item.startPeriod} -{" "}
                  {item.startPeriod + item.numberOfPeriods - 1}
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
                <TableCell sx={{ fontWeight: 600 }}>{item.room}</TableCell>
                <TableCell>
                  {item.startDate} - {item.endDate}
                </TableCell>
              </TableRow>
            ))}
            {scheduleData.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  Chưa có lịch dạy nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
