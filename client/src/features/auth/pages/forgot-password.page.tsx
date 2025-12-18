import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Paper,
  Container,
  InputAdornment,
} from "@mui/material";
import { ArrowBack, Email as EmailIcon, Send } from "@mui/icons-material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForgotPasswordForm } from "../hooks/useForgotPasswordForm";
import { usePageMeta } from "@/hooks/usePageMeta";
import { ROUTE_PATHS } from "@/constants/route-path.constants";
import styles from "./login.module.scss";

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  // Hide scrollbar on body when forgot password page is mounted
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    emailValidation,
    isLoading,
  } = useForgotPasswordForm();

  usePageMeta(
    "Quên mật khẩu - Hệ thống quản lý đào tạo",
    "Khôi phục mật khẩu tài khoản của bạn"
  );

  return (
    <Box className={styles.loginContainer}>
      <Box className={styles.leftSection}>
        <Box className={styles.contentWrapper}>
          <Box className={styles.logoSection}>
            <Box className={styles.logoCircle}>
              <EmailIcon className={styles.logoIcon} />
            </Box>
            <Typography variant="h4" className={styles.schoolName}>
              HỆ THỐNG
            </Typography>
            <Typography variant="h4" className={styles.schoolName}>
              QUẢN LÝ ĐÀO TẠO
            </Typography>
            <Typography variant="h6" className={styles.systemName}>
              KHÔI PHỤC MẬT KHẨU
            </Typography>
          </Box>

          <Box className={styles.infoSection}>
            <Typography variant="body1" className={styles.infoText}>
              Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn một liên
              kết để đặt lại mật khẩu.
            </Typography>
          </Box>
        </Box>

        <Box className={styles.decorativeElements}>
          <Box className={styles.circle1}></Box>
          <Box className={styles.circle2}></Box>
          <Box className={styles.circle3}></Box>
        </Box>
      </Box>

      <Box className={styles.rightSection}>
        <Container maxWidth="sm" className={styles.container}>
          <Paper elevation={0} className={styles.loginCard}>
            <Box className={styles.header}>
              <Typography variant="h4" className={styles.title}>
                Quên mật khẩu?
              </Typography>
              <Typography variant="body2" className={styles.subtitle}>
                Đừng lo lắng, chúng tôi sẽ giúp bạn khôi phục
              </Typography>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
              <TextField
                fullWidth
                label="Email đăng ký"
                variant="outlined"
                {...register("email", emailValidation)}
                error={!!errors.email}
                helperText={errors.email?.message}
                className={styles.input}
                autoComplete="email"
                disabled={isLoading}
                placeholder="Nhập email của bạn"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: "#9ca3af" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                className={styles.loginButton}
                disabled={isLoading}
                size="large"
                startIcon={!isLoading && <Send />}
              >
                {isLoading ? "Đang gửi..." : "Gửi link đặt lại mật khẩu"}
              </Button>

              <Box className={styles.forgotPasswordSection}>
                <Link
                  component="button"
                  onClick={() => navigate(ROUTE_PATHS.LOGIN)}
                  className={styles.forgotPasswordLink}
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <ArrowBack fontSize="small" />
                  Quay lại đăng nhập
                </Link>
              </Box>
            </form>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};
