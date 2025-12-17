import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import {
  School,
  ArrowBack,
  Visibility,
  VisibilityOff,
  LockReset,
} from "@mui/icons-material";
import { useResetPasswordForm } from "../hooks/useResetPasswordForm";
import { usePageMeta } from "@/hooks/usePageMeta";
import { ROUTE_PATHS } from "@/constants/route-path.constants";
import styles from "./login.module.scss";

/**
 * Reset Password Page Component
 * Follows Open/Closed Principle - extends login styles without modification
 */
export const ResetPasswordPage = () => {
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    token,
    isTokenValidating,
    isTokenValid,
    showPassword,
    showConfirmPassword,
    handleTogglePassword,
    handleToggleConfirmPassword,
    passwordValidation,
    confirmPasswordValidation,
    isLoading,
  } = useResetPasswordForm();

  usePageMeta(
    "Đặt lại mật khẩu - Hệ thống quản lý đào tạo",
    "Tạo mật khẩu mới cho tài khoản của bạn"
  );

  // Show loading while validating token
  if (isTokenValidating) {
    return (
      <Box className={styles.loginContainer}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            gap: 2,
          }}
        >
          <CircularProgress />
          <Typography>Đang xác thực...</Typography>
        </Box>
      </Box>
    );
  }

  // Show error if token is invalid
  if (!token || !isTokenValid) {
    return (
      <Box className={styles.loginContainer}>
        <Box className={styles.rightSection}>
          <Box className={styles.loginCard}>
            <Typography color="error" sx={{ mb: 2 }}>
              Link không hợp lệ hoặc đã hết hạn
            </Typography>
            <Link href={ROUTE_PATHS.FORGOT_PASSWORD}>
              <Button variant="contained" fullWidth>
                Yêu cầu link mới
              </Button>
            </Link>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box className={styles.loginContainer}>
      <Box className={styles.leftSection}>
        <Box className={styles.logoSection}>
          <School className={styles.logoIcon} />
          <Typography variant="h4" className={styles.schoolName}>
            HỆ THỐNG QUẢN LÝ ĐÀO TẠO
          </Typography>
          <Typography variant="h6" className={styles.systemName}>
            CỔNG THÔNG TIN ĐIỆN TỬ
          </Typography>
        </Box>
        <Box className={styles.illustrationSection}>
          <LockReset
            sx={{ fontSize: 200, color: "rgba(255, 255, 255, 0.2)" }}
          />
        </Box>
      </Box>

      <Box className={styles.rightSection}>
        <Box className={styles.loginCard}>
          <Box className={styles.header}>
            <Typography variant="h4" className={styles.title}>
              ĐẶT LẠI MẬT KHẨU
            </Typography>
            <Typography variant="body2" className={styles.subtitle}>
              Nhập mật khẩu mới cho tài khoản của bạn
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <TextField
              fullWidth
              label="Mật khẩu mới"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              {...register("newPassword", passwordValidation)}
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
              className={styles.input}
              autoComplete="new-password"
              disabled={isLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePassword}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Xác nhận mật khẩu"
              type={showConfirmPassword ? "text" : "password"}
              variant="outlined"
              {...register("confirmPassword", confirmPasswordValidation)}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              className={styles.input}
              autoComplete="new-password"
              disabled={isLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleToggleConfirmPassword}
                      edge="end"
                      aria-label="toggle confirm password visibility"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
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
            >
              {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
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
