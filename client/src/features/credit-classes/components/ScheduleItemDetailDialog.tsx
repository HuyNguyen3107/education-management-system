import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
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
import type { ScheduleItem } from "../types/credit-class.types";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EventIcon from "@mui/icons-material/Event";

interface ScheduleItemDetailDialogProps {
  open: boolean;
  onClose: () => void;
  scheduleItems: ScheduleItem[];
  creditClassName?: string;
}

const DAY_LABELS: Record<string, string> = {
  "2": "Thứ 2",
  "3": "Thứ 3",
  "4": "Thứ 4",
  "5": "Thứ 5",
  "6": "Thứ 6",
  "7": "Thứ 7",
  CN: "Chủ nhật",
  "0": "Chủ nhật",
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

export const ScheduleItemDetailDialog = ({
  open,
  onClose,
  scheduleItems,
  creditClassName,
}: ScheduleItemDetailDialogProps) => {
  if (!scheduleItems || scheduleItems.length === 0) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Chi tiết tiết thành phần</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography color="text.secondary">
              Chưa có thông tin lịch học
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="contained">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CalendarTodayIcon color="primary" />
          <Box>
            <Typography variant="h6" component="div">
              Chi tiết tiết thành phần
            </Typography>
            {creditClassName && (
              <Typography variant="body2" color="text.secondary">
                {creditClassName}
              </Typography>
            )}
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: 600 }}>STT</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Thứ</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    Tiết bắt đầu
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    Số tiết
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    Tiết kết thúc
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Ngày bắt đầu</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Ngày kết thúc</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Phòng học</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {scheduleItems.map((item, index) => {
                  const endPeriod = item.startPeriod + item.numberOfPeriods - 1;
                  return (
                    <TableRow key={index} hover>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Chip
                          label={DAY_LABELS[item.dayOfWeek] || item.dayOfWeek}
                          size="small"
                          color="primary"
                          variant="outlined"
                          icon={<EventIcon />}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={`Tiết ${item.startPeriod}`}
                          size="small"
                          color="info"
                          icon={<AccessTimeIcon />}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" fontWeight={500}>
                          {item.numberOfPeriods} tiết
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={`Tiết ${endPeriod}`}
                          size="small"
                          color="info"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        {item.startDate ? (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <CalendarTodayIcon
                              fontSize="small"
                              color="action"
                            />
                            <Typography variant="body2">
                              {formatDate(item.startDate)}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            -
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {item.endDate ? (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <CalendarTodayIcon
                              fontSize="small"
                              color="action"
                            />
                            <Typography variant="body2">
                              {formatDate(item.endDate)}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            -
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {item.room ? (
                          <Chip
                            label={item.room}
                            size="small"
                            color="secondary"
                            variant="outlined"
                            icon={<LocationOnIcon />}
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            -
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Summary Section */}
          <Box sx={{ mt: 3 }}>
            <Paper variant="outlined" sx={{ p: 2, bgcolor: "#f9fafb" }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                Tóm tắt:
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Tổng số tiết học:
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {scheduleItems.reduce(
                      (sum, item) => sum + item.numberOfPeriods,
                      0
                    )}{" "}
                    tiết
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Số buổi học:
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {scheduleItems.length} buổi
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Số ngày học/tuần:
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {new Set(scheduleItems.map((item) => item.dayOfWeek)).size}{" "}
                    ngày
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};
