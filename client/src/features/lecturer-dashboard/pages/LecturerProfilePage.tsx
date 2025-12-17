import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Avatar,
  Divider,
  Paper,
  Stack,
  Chip,
} from "@mui/material";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon,
  Cake as CakeIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Badge as BadgeIcon,
} from "@mui/icons-material";
import { useLecturerProfile } from "../queries/lecturer-dashboard.queries";
import { usePageMeta } from "@/hooks/usePageMeta";

export const LecturerProfilePage = () => {
  usePageMeta("Thông tin giảng viên");
  const { data: profile, isLoading } = useLecturerProfile();

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (!profile) {
    return <Typography>Không tìm thấy thông tin.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
        Hồ sơ giảng viên
      </Typography>

      <Grid container spacing={3}>
        {/* Left Column - Avatar & Basic Info */}
        <Grid size={12}>
          <Card
            elevation={0}
            sx={{
              borderRadius: "16px",
              border: "1px solid #e5e7eb",
              textAlign: "center",
              p: 3,
            }}
          >
            <Avatar
              sx={{
                width: 120,
                height: 120,
                mx: "auto",
                mb: 2,
                bgcolor: "primary.main",
                fontSize: "3rem",
              }}
            >
              {profile.name.charAt(0)}
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {profile.name}
            </Typography>
            <Chip
              label="Giảng viên"
              color="primary"
              size="small"
              sx={{ mt: 1, mb: 2 }}
            />

            <Divider sx={{ my: 2 }} />

            <Stack spacing={2} alignItems="flex-start">
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <BadgeIcon color="action" />
                <Typography variant="body2">{profile.teacherCode}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <EmailIcon color="action" />
                <Typography variant="body2">{profile.email}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <PhoneIcon color="action" />
                <Typography variant="body2">{profile.phone}</Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>

        {/* Right Column - Detailed Info */}
        <Grid size={12}>
          <Card
            elevation={0}
            sx={{
              borderRadius: "16px",
              border: "1px solid #e5e7eb",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Thông tin chi tiết
              </Typography>

              <Grid container spacing={3}>
                <Grid size={12}>
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mb: 0.5, display: "block" }}
                    >
                      Họ và tên
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {profile.name}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={12}>
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mb: 0.5, display: "block" }}
                    >
                      Giới tính
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {profile.gender}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={12}>
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mb: 0.5, display: "block" }}
                    >
                      Ngày sinh
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <CakeIcon fontSize="small" color="action" />
                        {profile.dateOfBirth}
                      </Box>
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={12}>
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mb: 0.5, display: "block" }}
                    >
                      Mã giảng viên
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <SchoolIcon fontSize="small" color="action" />
                        {profile.teacherCode}
                      </Box>
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={12}>
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mb: 0.5, display: "block" }}
                    >
                      Địa chỉ
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <LocationOnIcon fontSize="small" color="action" />
                        {profile.address}
                      </Box>
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
