import { Box, TextField, Button, Typography, Link, Alert } from "@mui/material";
import { School, ArrowBack, Email } from "@mui/icons-material";
import { useForgotPasswordForm } from "../hooks/useForgotPasswordForm";
import { usePageMeta } from "@/hooks/usePageMeta";
import { ROUTE_PATHS } from "@/constants/route-path.constants";
import styles from "./login.module.scss";

/**
 * Forgot Password Page Component
 * Follows Open/Closed Principle - extends login styles without modification
 */
export const ForgotPasswordPage = () => {
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    emailValidation,
    isLoading,
    isError,
    isSuccess,
    errorMessage,
    successMessage,
  } = useForgotPasswordForm();

  usePageMeta(
    "Quên mật khẩu - Học viện Công nghệ Bưu chính Viễn thông",
    "Khôi phục mật khẩu tài khoản của bạn"
  );

  return (
    <Box className={styles.loginContainer}>
      <Box className={styles.leftSection}>
        <Box className={styles.logoSection}>
          <School className={styles.logoIcon} />
          <Typography variant="h4" className={styles.schoolName}>
            HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG
          </Typography>
          <Typography variant="h6" className={styles.systemName}>
            CỔNG THÔNG TIN QUẢN LÝ ĐÀO TẠO
          </Typography>
        </Box>
        <Box className={styles.illustrationSection}>
          <Email sx={{ fontSize: 200, color: "rgba(255, 255, 255, 0.2)" }} />
        </Box>
      </Box>

      <Box className={styles.rightSection}>
        <Box className={styles.loginCard}>
          <Box className={styles.header}>
            <Typography variant="h4" className={styles.title}>
              QUÊN MẬT KHẨU
            </Typography>
            <Typography variant="body2" className={styles.subtitle}>
              Nhập email để nhận link đặt lại mật khẩu
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            {isSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {successMessage}
              </Alert>
            )}

            {isError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorMessage}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              {...register("email", emailValidation)}
              error={!!errors.email}
              helperText={errors.email?.message}
              className={styles.input}
              autoComplete="email"
              disabled={isLoading}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              className={styles.loginButton}
              disabled={isLoading}
            >
              {isLoading ? "Đang gửi..." : "Gửi link đặt lại mật khẩu"}
            </Button>

            <Box className={styles.forgotPasswordSection}>
              <Link
                href={ROUTE_PATHS.LOGIN}
                className={styles.forgotPasswordLink}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <ArrowBack fontSize="small" />
                Quay lại đăng nhập
              </Link>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
};
