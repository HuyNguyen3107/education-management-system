import { Typography, Box, Button, IconButton } from "@mui/material";
import { StatCard } from "../components/StatCard/StatCard";
import { RecentActivitiesTable } from "../components/RecentActivitiesTable/RecentActivitiesTable";
import { RevenueChart } from "../components/RevenueChart/RevenueChart";
import { EnrollmentChart } from "../components/EnrollmentChart/EnrollmentChart";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SchoolIcon from "@mui/icons-material/School";
import ClassIcon from "@mui/icons-material/Class";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import FilterListIcon from "@mui/icons-material/FilterList";

export const DashboardPage = () => {
  const currentDate = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Box>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: "#111827",
              mb: 1,
              letterSpacing: "-1px",
            }}
          >
            Xin chào, Admin! 👋
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#6b7280",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <CalendarTodayIcon fontSize="small" />
            Hôm nay là {currentDate}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              color: "#374151",
              borderColor: "#e5e7eb",
              bgcolor: "#fff",
              "&:hover": {
                bgcolor: "#f9fafb",
                borderColor: "#d1d5db",
              },
            }}
          >
            Bộ lọc
          </Button>
          <Button
            variant="contained"
            disableElevation
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              bgcolor: "#111827",
              "&:hover": {
                bgcolor: "#374151",
              },
            }}
          >
            Tải báo cáo
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "repeat(4, 1fr)",
          },
          gap: 3,
          mb: 3,
        }}
      >
        <StatCard
          title="Tổng số sinh viên"
          value="2,543"
          icon={<PeopleAltIcon fontSize="large" />}
          color="#3b82f6"
          trend="+12%"
          trendUp={true}
        />
        <StatCard
          title="Giảng viên"
          value="145"
          icon={<SchoolIcon fontSize="large" />}
          color="#8b5cf6"
          trend="+2"
          trendUp={true}
        />
        <StatCard
          title="Lớp học đang mở"
          value="58"
          icon={<ClassIcon fontSize="large" />}
          color="#f59e0b"
          trend="-5%"
          trendUp={false}
        />
        <StatCard
          title="Doanh thu tháng"
          value="1.2 tỷ"
          icon={<MonetizationOnIcon fontSize="large" />}
          color="#10b981"
          trend="+8%"
          trendUp={true}
        />
      </Box>

      {/* Charts Section */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
          gap: 3,
          mb: 3,
        }}
      >
        <Box>
          <RevenueChart />
        </Box>
        <Box>
          <EnrollmentChart />
        </Box>
      </Box>

      {/* Bottom Section: Table & Notifications */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
          gap: 3,
        }}
      >
        <Box>
          <RecentActivitiesTable />
        </Box>
        <Box
          sx={{
            p: 3,
            height: "100%",
            bgcolor: "#fff",
            borderRadius: "24px",
            border: "1px solid rgba(0,0,0,0.03)",
            boxShadow:
              "0px 1px 2px rgba(0, 0, 0, 0.08), 0px 4px 12px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#111827" }}>
              Thông báo mới
            </Typography>
            <IconButton size="small" sx={{ color: "#9ca3af" }}>
              <NotificationsNoneIcon />
            </IconButton>
          </Box>

          {[1, 2, 3, 4].map((item) => (
            <Box
              key={item}
              sx={{
                mb: 2,
                p: 2,
                bgcolor: "#f9fafb",
                borderRadius: "16px",
                display: "flex",
                gap: 2,
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateX(4px)",
                  bgcolor: "#f3f4f6",
                },
              }}
            >
              <Box
                sx={{
                  minWidth: 40,
                  height: 40,
                  borderRadius: "12px",
                  bgcolor: item % 2 === 0 ? "#dbeafe" : "#fce7f3",
                  color: item % 2 === 0 ? "#1e40af" : "#be185d",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                }}
              >
                {item}
              </Box>
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, color: "#1f2937" }}
                >
                  Thông báo hệ thống #{item}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "#6b7280", display: "block", mt: 0.5 }}
                >
                  Hệ thống bảo trì vào lúc 22:00 hôm nay. Vui lòng lưu lại công
                  việc.
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#9ca3af",
                    fontWeight: 500,
                    mt: 1,
                    display: "block",
                  }}
                >
                  2 giờ trước
                </Typography>
              </Box>
            </Box>
          ))}

          <Button
            fullWidth
            variant="outlined"
            sx={{
              mt: 1,
              borderRadius: "12px",
              textTransform: "none",
              borderColor: "#e5e7eb",
              color: "#4b5563",
              "&:hover": {
                borderColor: "#d1d5db",
                bgcolor: "#f9fafb",
              },
            }}
          >
            Xem tất cả
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
