import { Box, Container, Typography } from "@mui/material";

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        background: "linear-gradient(180deg, #B71C1C 0%, #8B0000 100%)",
        color: "#fff",
        py: 1.5,
        px: 2,
        width: "100%",
        margin: 0,
      }}
    >
      <Container maxWidth="xl" sx={{ px: 2 }}>
        <Box
          sx={{
            mt: 1,
            pt: 1,
            textAlign: "center",
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.75rem" }}
          >
            © 2025 Education Management System. Tất cả quyền được bảo lưu.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

