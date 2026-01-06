import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  IconButton,
  InputAdornment,
  Paper,
  Container,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  School,
  Email as EmailIcon,
  Lock,
} from "@mui/icons-material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { useLoginForm } from "../hooks/useLoginForm";
import { usePageMeta } from "@/hooks/usePageMeta";
import { ROUTE_PATHS } from "@/constants/route-path.constants";
import styles from "./login.module.scss";

export const LoginPage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate(ROUTE_PATHS.DASHBOARD, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Hide scrollbar on body when login page is mounted
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
    showPassword,
    handleTogglePassword,
    emailValidation,
    passwordValidation,
    isLoading,
  } = useLoginForm();

  usePageMeta(
    "Đăng nhập - Hệ thống quản lý đào tạo",
    "Đăng nhập vào cổng thông tin quản lý đào tạo để quản lý lịch học, điểm và thông tin học tập."
  );

  return (
    <Box className={styles.loginContainer}>
      <Box className={styles.leftSection}>
        <Box className={styles.contentWrapper}>
          <Box className={styles.logoSection}>
            <Box className={styles.logoCircle}>
              <School className={styles.logoIcon} />
            </Box>
            <Typography variant="h4" className={styles.schoolName}>
              HỆ THỐNG
            </Typography>
            <Typography variant="h4" className={styles.schoolName}>
              QUẢN LÝ ĐÀO TẠO
            </Typography>
            <Typography variant="h6" className={styles.systemName}>
              CỔNG THÔNG TIN QUẢN LÝ ĐÀO TẠO
            </Typography>
          </Box>

          <Box className={styles.featuresSection}>
            <Box className={styles.featureItem}>
              <Box className={styles.featureIcon}>
                <School />
              </Box>
              <Typography variant="body1" className={styles.featureText}>
                Quản lý học tập hiệu quả
              </Typography>
            </Box>
            <Box className={styles.featureItem}>
              <Box className={styles.featureIcon}>
                <School />
              </Box>
              <Typography variant="body1" className={styles.featureText}>
                Theo dõi lịch học và điểm số
              </Typography>
            </Box>
            <Box className={styles.featureItem}>
              <Box className={styles.featureIcon}>
                <School />
              </Box>
              <Typography variant="body1" className={styles.featureText}>
                Thông tin cập nhật 24/7
              </Typography>
            </Box>
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
                Chào mừng trở lại
              </Typography>
              <Typography variant="body2" className={styles.subtitle}>
                Đăng nhập để tiếp tục sử dụng hệ thống
              </Typography>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
              <TextField
                fullWidth
                label="Email hoặc tên đăng nhập"
                variant="outlined"
                {...register("email", emailValidation)}
                error={!!errors.email}
                helperText={errors.email?.message}
                className={styles.input}
                autoComplete="username"
                disabled={isLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: "#9ca3af" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Mật khẩu"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                {...register("password", passwordValidation)}
                error={!!errors.password}
                helperText={errors.password?.message}
                className={styles.input}
                autoComplete="current-password"
                disabled={isLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: "#9ca3af" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePassword}
                        edge="end"
                        aria-label="toggle password visibility"
                        size="small"
                      >
                        {showPassword ? (
                          <VisibilityOff sx={{ color: "#9ca3af" }} />
                        ) : (
                          <Visibility sx={{ color: "#9ca3af" }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box className={styles.forgotPasswordSection}>
                <Link
                  component="button"
                  type="button"
                  onClick={() => navigate(ROUTE_PATHS.FORGOT_PASSWORD)}
                  className={styles.forgotPasswordLink}
                >
                  Quên mật khẩu?
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                className={styles.loginButton}
                disabled={isLoading}
                size="large"
              >
                {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </form>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};
