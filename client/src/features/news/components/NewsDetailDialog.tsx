import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import type { News } from "../types/news.types";
import { RichTextDisplay } from "@/components/RichTextEditor";

interface NewsDetailDialogProps {
  open: boolean;
  onClose: () => void;
  data: News | null;
}

export const NewsDetailDialog = ({
  open,
  onClose,
  data,
}: NewsDetailDialogProps) => {
  if (!data) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: "#1976d2", color: "white" }}>
        <Typography variant="h6" fontWeight={600}>
          Chi tiết tin tức
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight={600} sx={{ mb: 1 }}>
            {data.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Ngày đăng: {new Date(data.createdAt).toLocaleString("vi-VN")}
          </Typography>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

