import { Box, Container, Typography, Divider, Link } from "@mui/material";
import { School as SchoolIcon } from "@mui/icons-material";

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#1f2937",
        color: "#fff",
        py: 4,
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "center", md: "flex-start" },
            gap: 3,
          }}
        >
          {/* Logo and Description */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "center", md: "flex-start" },
              gap: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <SchoolIcon sx={{ fontSize: 32, color: "#B71C1C" }} />
              <Typography variant="h6" fontWeight={700}>
                Education Management System
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                textAlign: { xs: "center", md: "left" },
                maxWidth: 300,
              }}
            >
              Hệ thống quản lý giáo dục hiện đại, hỗ trợ quản lý toàn diện các
              hoạt động trong trường học.
            </Typography>
          </Box>

          {/* Quick Links */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              alignItems: { xs: "center", md: "flex-start" },
            }}
          >
            <Typography variant="h6" fontWeight={600} mb={1}>
              Liên kết nhanh
            </Typography>
            <Link
              href="#"
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                textDecoration: "none",
                "&:hover": {
                  color: "#fff",
                  textDecoration: "underline",
                },
              }}
            >
              Trang chủ
            </Link>
            <Link
              href="#"
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                textDecoration: "none",
                "&:hover": {
                  color: "#fff",
                  textDecoration: "underline",
                },
              }}
            >
              Tin tức
            </Link>
            <Link
              href="#"
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                textDecoration: "none",
                "&:hover": {
                  color: "#fff",
                  textDecoration: "underline",
                },
              }}
            >
              Giới thiệu
            </Link>
          </Box>

          {/* Contact Info */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              alignItems: { xs: "center", md: "flex-start" },
            }}
          >
            <Typography variant="h6" fontWeight={600} mb={1}>
              Liên hệ
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
              Email: info@ems.edu.vn
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
              Điện thoại: 0123 456 789
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
              Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3, borderColor: "rgba(255, 255, 255, 0.1)" }} />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
            © 2025 Education Management System. Tất cả quyền được bảo lưu.
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
            Version 1.0.0
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

