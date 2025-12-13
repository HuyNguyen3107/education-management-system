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
} from "@mui/material";
import type { NotificationWithUser } from "../types/notification.types";
import { RichTextDisplay } from "@/components/RichTextEditor";

interface NotificationDetailDialogProps {
  open: boolean;
  onClose: () => void;
  data: NotificationWithUser | null;
}

export const NotificationDetailDialog = ({
  open,
  onClose,
  data,
}: NotificationDetailDialogProps) => {
  if (!data) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: "#1976d2", color: "white" }}>
        <Typography variant="h6" fontWeight={600}>
          Chi tiết thông báo
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight={600} sx={{ mb: 1 }}>
            {data.title}
          </Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
            <Typography variant="caption" color="text.secondary">
              Ngày tạo: {new Date(data.createdAt).toLocaleString("vi-VN")}
            </Typography>
            {data.user && (
              <Chip
                label={`Gửi đến: ${data.user.fullName}`}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {data.seenDate ? (
              <Chip label="Đã xem" size="small" color="success" variant="outlined" />
            ) : (
              <Chip label="Chưa xem" size="small" color="warning" variant="outlined" />
            )}
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Nội dung:
          </Typography>
          <Box
            sx={{
              p: 2,
              bgcolor: "#fafafa",
              borderRadius: 1,
              border: "1px solid #e0e0e0",
            }}
          >
            <RichTextDisplay content={data.content} />
          </Box>
        </Box>

        {data.response && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Phản hồi:
            </Typography>
            <Box
              sx={{
                p: 2,
                bgcolor: "#e3f2fd",
                borderRadius: 1,
                border: "1px solid #90caf9",
              }}
            >
              <RichTextDisplay content={data.response} />
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

