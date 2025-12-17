import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Divider,
  Stack,
} from "@mui/material";
import {
  CalendarToday as CalendarIcon,
  Room as RoomIcon,
  Group as GroupIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { useLecturerClasses } from "../queries/lecturer-dashboard.queries";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useNavigate } from "react-router-dom";

export const LecturerClassesPage = () => {
  usePageMeta("Lớp học phần");
  const { data: classes, isLoading } = useLecturerClasses();
  const navigate = useNavigate();

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
        Danh sách lớp học phần
      </Typography>

      <Grid container spacing={3}>
        {classes?.map((cls) => (
          <Grid size={12} key={cls.id}>
            <Card
              elevation={0}
              sx={{
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                transition: "all 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 12px 24px -10px rgba(0, 0, 0, 0.1)",
                  borderColor: "primary.main",
                },
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                      {cls.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      <Chip
                        label={cls.subjectCode}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ height: 20, fontSize: "0.7rem" }}
                      />
                      <Chip
                        label={`Nhóm ${cls.group}`}
                        size="small"
                        color="secondary"
                        variant="outlined"
                        sx={{ height: 20, fontSize: "0.7rem" }}
                      />
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Stack spacing={1.5}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <RoomIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      Phòng: <b>{cls.room}</b>
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <GroupIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      Sĩ số:{" "}
                      <b>
                        {cls.enrolledCount} / {cls.quantity}
                      </b>
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <CalendarIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      Học kỳ: {cls.semester}
                    </Typography>
                  </Box>
                </Stack>

                <Button
                  fullWidth
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ mt: 3, borderRadius: "8px" }}
                  onClick={() =>
                    navigate(`/lecturer/classes/${cls.id}/students`)
                  }
                >
                  Xem danh sách
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {classes?.length === 0 && (
          <Grid size={12}>
            <Typography align="center" color="text.secondary">
              Hiện không có lớp học phần nào được phân công.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
