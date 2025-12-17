import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import type { CreditClass, ScheduleItem } from "../types/credit-class.types";

interface CreditClassDetailDialogProps {
  open: boolean;
  onClose: () => void;
  data: CreditClass | null;
  lecturerName?: string;
}

// Days of week mapping
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

const formatDate = (dateStr: string) => {
  if (!dateStr) return "-";
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN");
  } catch {
    return dateStr;
  }
};

export const CreditClassDetailDialog = ({
  open,
  onClose,
  data,
  lecturerName,
}: CreditClassDetailDialogProps) => {
  if (!data) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: "#1976d2", color: "white" }}>
        <Typography variant="h6" fontWeight={600}>
          Chi tiết lớp tín chỉ
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          {data.name}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        {/* Basic Info */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Mã học phần:
            </Typography>
            <Chip
              label={data.subjectCode}
              color="primary"
              variant="outlined"
              sx={{ mt: 0.5 }}
            />
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Giảng viên:
            </Typography>
            <Typography fontWeight={500} sx={{ mt: 0.5 }}>
              {lecturerName || data.teacherId}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Nhóm:
            </Typography>
            <Typography sx={{ mt: 0.5 }}>{data.group || "-"}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Sĩ số:
            </Typography>
            <Chip
              label={`${data.quantity} sinh viên`}
              color="info"
              size="small"
              sx={{ mt: 0.5 }}
            />
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Phòng học chung:
            </Typography>
            <Typography sx={{ mt: 0.5 }}>{data.room || "-"}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Học kỳ:
            </Typography>
            <Chip
              label={data.semester}
              color="secondary"
              variant="outlined"
              sx={{ mt: 0.5 }}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Schedule Table */}
        <Box>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Lịch học chi tiết
          </Typography>

          {data.schedule && data.schedule.length > 0 ? (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                    <TableCell sx={{ fontWeight: 600, width: 60 }}>
                      STT
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Thứ</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">
                      Tiết bắt đầu
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">
                      Số tiết
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      Thời gian học
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Phòng</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.schedule.map((item: ScheduleItem, index: number) => (
                    <TableRow key={index} hover>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Chip
                          label={DAY_LABELS[item.dayOfWeek] || item.dayOfWeek}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">{item.startPeriod}</TableCell>
                      <TableCell align="center">
                        {item.numberOfPeriods}
                      </TableCell>
                      <TableCell>
                        {item.startDate || item.endDate ? (
                          <Typography variant="body2">
                            {formatDate(item.startDate)} đến{" "}
                            {formatDate(item.endDate)}
                          </Typography>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        {item.room ? (
                          <Chip
                            label={item.room}
                            size="small"
                            variant="outlined"
                          />
                        ) : (
                          data.room || "-"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Paper variant="outlined" sx={{ p: 3, textAlign: "center" }}>
              <Typography color="text.secondary">Chưa có lịch học</Typography>
            </Paper>
          )}
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
