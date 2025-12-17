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
  TextField,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import {
  CalendarToday as CalendarIcon,
  Room as RoomIcon,
  Group as GroupIcon,
  ArrowForward as ArrowForwardIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useLecturerClasses } from "../queries/lecturer-dashboard.queries";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const LecturerClassesPage = () => {
  usePageMeta("Lớp học phần");
  const { data: classes, isLoading } = useLecturerClasses();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClasses = classes?.filter((cls) => {
    const search = searchTerm.toLowerCase();
    const name = cls.name ? cls.name.toLowerCase() : "";
    const subjectCode = cls.subjectCode ? cls.subjectCode.toLowerCase() : "";
    const room = cls.room ? cls.room.toLowerCase() : "";

    return (
      name.includes(search) ||
      subjectCode.includes(search) ||
      room.includes(search)
    );
  });

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Danh sách lớp học phần
        </Typography>
        <TextField
          placeholder="Tìm kiếm lớp học..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300, bgcolor: "white", borderRadius: 1 }}
        />
      </Box>

      <Grid container spacing={3}>
        {filteredClasses?.map((cls) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={cls.id}>
            <Card
              elevation={0}
              sx={{
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                transition: "all 0.2s",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 12px 24px -10px rgba(0, 0, 0, 0.1)",
                  borderColor: "primary.main",
                },
              }}
            >
              <CardContent
                sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Box sx={{ width: "100%" }}>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      gutterBottom
                      sx={{
                        minHeight: 64,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {cls.name}
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={1}
                      flexWrap="wrap"
                      useFlexGap
                      sx={{ mt: 1 }}
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
                    </Stack>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Stack spacing={1.5} sx={{ mb: 2 }}>
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

                <Box sx={{ mt: "auto" }}>
                  <Button
                    fullWidth
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    sx={{ borderRadius: "8px" }}
                    onClick={() =>
                      navigate(`/lecturer/classes/${cls.id}/students`)
                    }
                  >
                    Xem danh sách
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {filteredClasses?.length === 0 && (
          <Grid size={12}>
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography align="center" color="text.secondary" variant="h6">
                Không tìm thấy lớp học nào.
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
