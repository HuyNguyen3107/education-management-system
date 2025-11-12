import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  School,
  Microsoft,
} from "@mui/icons-material";
import { useLoginForm } from "../hooks/useLoginForm";
import { usePageMeta } from "@/hooks/usePageMeta";
import styles from "./login.module.scss";

export const LoginPage = () => {
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
    isError,
    errorMessage,
  } = useLoginForm();

  usePageMeta(
    "Đăng nhập - Học viện Công nghệ Bưu chính Viễn thông",
    "Đăng nhập vào cổng thông tin quản lý đào tạo của Học viện Công nghệ Bưu chính Viễn thông để quản lý lịch học, điểm và thông tin học tập."
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
          <School className={styles.illustrationIcon} />
        </Box>
      </Box>

      <Box className={styles.rightSection}>
        <Box className={styles.loginCard}>
          <Box className={styles.header}>
            <Typography variant="h4" className={styles.title}>
              ĐĂNG NHẬP
            </Typography>
            <Typography variant="body2" className={styles.subtitle}>
              Vui lòng đăng nhập để tiếp tục
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <TextField
              fullWidth
              label="Tên đăng nhập hoặc Email"
              variant="outlined"
              {...register("email", emailValidation)}
              error={!!errors.email}
              helperText={errors.email?.message}
              className={styles.input}
              autoComplete="username"
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

            <Box className={styles.forgotPasswordSection}>
              <Link
                href="/forgot-password"
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
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>

            {isError && (
              <Typography className={styles.errorMessage}>
                {errorMessage}
              </Typography>
            )}

            <Box className={styles.divider}>
              <span>Hoặc</span>
            </Box>

            <Button
              fullWidth
              variant="outlined"
              className={styles.microsoftButton}
              startIcon={<Microsoft />}
            >
              Đăng nhập với Microsoft Office 365
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
};
