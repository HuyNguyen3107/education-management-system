import { Box, Typography, Card, CardContent, Grid } from "@mui/material";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useAuthStore } from "@/store/auth.store";

export const LecturerDashboardPage = () => {
  usePageMeta("Tổng quan giảng viên");
  const user = useAuthStore((state) => state.user);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
        Xin chào, {user?.name || "Giảng viên"}! 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid size={12}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)",
              color: "white",
              borderRadius: "16px",
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Lớp học phần
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, my: 2 }}>
                --
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Lớp đang phụ trách
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={12}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #43a047 0%, #2e7d32 100%)",
              color: "white",
              borderRadius: "16px",
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Lịch dạy hôm nay
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, my: 2 }}>
                --
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Tiết học
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
