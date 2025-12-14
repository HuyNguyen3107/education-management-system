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
  Grid,
} from "@mui/material";
import type { AspirationRegister } from "../types/aspiration-register.types";
import { RichTextDisplay } from "@/components/RichTextEditor";

interface AspirationRegisterDetailDialogProps {
  open: boolean;
  onClose: () => void;
  data: AspirationRegister | null;
  studentCode?: string;
  subjectName?: string;
}

export const AspirationRegisterDetailDialog = ({
  open,
  onClose,
  data,
  studentCode,
  subjectName,
}: AspirationRegisterDetailDialogProps) => {
  if (!data) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: "#1976d2", color: "white" }}>
        <Typography variant="h6" fontWeight={600}>
          Chi tiết nguyện vọng đăng ký
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Sinh viên:
            </Typography>
            <Chip
              label={studentCode || data.studentId}
              color="primary"
              variant="outlined"
              sx={{ mt: 0.5 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Học kỳ:
            </Typography>
            <Chip
              label={data.semester}
              color="secondary"
              variant="outlined"
              sx={{ mt: 0.5 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Mã môn học:
            </Typography>
            <Chip
              label={data.subjectCode}
              color="info"
              variant="outlined"
              sx={{ mt: 0.5 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Tên môn học:
            </Typography>
            <Typography fontWeight={500} sx={{ mt: 0.5 }}>
              {subjectName || "-"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">
              Ngày đăng ký:
            </Typography>
            <Typography sx={{ mt: 0.5 }}>
              {new Date(data.createdAt).toLocaleString("vi-VN")}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 3 }} />

        <Box>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Lý do đăng ký:
          </Typography>
          {data.reason ? (
            <Box
              sx={{
                p: 2,
                bgcolor: "#fafafa",
                borderRadius: 1,
                border: "1px solid #e0e0e0",
              }}
            >
              <RichTextDisplay content={data.reason} />
            </Box>
          ) : (
            <Typography color="text.secondary" fontStyle="italic">
              Không có lý do
            </Typography>
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

