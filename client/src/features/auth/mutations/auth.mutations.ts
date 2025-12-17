import { useMutation } from "@tanstack/react-query";
import {
  login,
  logout,
  requestPasswordReset,
  validateToken,
  submitNewPassword,
} from "../services/auth.services";
import type {
  LoginRequest,
  LoginResponse,
  PasswordResetRequest,
  ResetPasswordRequest,
} from "../types/auth.types";
import { useAuthStore } from "@/store/auth.store";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "@/constants/route-path.constants";
import {
  showSuccessToast,
  showWarningToast,
  showApiErrorToast,
  getErrorMessage,
} from "@/libs/toast.libs";

// Login Mutation
export const useLoginMutation = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: (response: LoginResponse) => {
      const { token, message, ...user } = response;
      setAuth(token, user);
      showSuccessToast(message || "Đăng nhập thành công");

      // Điều hướng theo vai trò sau khi đăng nhập
      if (user.role === "STUDENT") {
        navigate(ROUTE_PATHS.PUBLIC_HOME);
      } else if (user.role === "LECTURER") {
        navigate(ROUTE_PATHS.LECTURER_HOME);
      } else {
        // Mặc định: ADMIN hoặc role khác
        navigate(ROUTE_PATHS.DASHBOARD);
      }
    },
    onError: (error: any) => {
      console.log(error);

      showApiErrorToast(
        error,
        "Đăng nhập thất bại. Vui lòng kiểm tra lại tên đăng nhập và mật khẩu."
      );
    },
  });
};

// Logout Mutation
export const useLogoutMutation = () => {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => logout(token!),
    onSuccess: () => {
      clearAuth();
      showSuccessToast("Đăng xuất thành công");
      navigate(ROUTE_PATHS.LOGIN);
    },
    onError: (error: any) => {
      showApiErrorToast(error, "Đăng xuất thất bại. Vui lòng thử lại.");
    },
  });
};

// Password Reset Request Mutation
export const usePasswordResetRequestMutation = () => {
  return useMutation({
    mutationFn: (data: PasswordResetRequest) => requestPasswordReset(data),
    onSuccess: (response) => {
      showSuccessToast(
        response.message ||
          "Yêu cầu đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra email."
      );
    },
    onError: (error: any) => {
      showApiErrorToast(
        error,
        "Không thể gửi yêu cầu đặt lại mật khẩu. Vui lòng thử lại."
      );
    },
  });
};

// Validate Token Mutation
export const useValidateTokenMutation = () => {
  return useMutation({
    mutationFn: (token: string) => validateToken(token),
    onError: (error: any) => {
      const errorMessage = getErrorMessage(
        error,
        "Token không hợp lệ hoặc đã hết hạn."
      );
      showWarningToast(errorMessage);
    },
  });
};

// Submit New Password Mutation
export const useSubmitNewPasswordMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => submitNewPassword(data),
    onSuccess: (response) => {
      showSuccessToast(
        response.message || "Mật khẩu đã được đặt lại thành công"
      );
      // Redirect to login after successful password reset
      setTimeout(() => {
        navigate(ROUTE_PATHS.LOGIN);
      }, 2000);
    },
    onError: (error: any) => {
      showApiErrorToast(
        error,
        "Không thể đặt lại mật khẩu. Vui lòng thử lại."
      );
    },
  });
};
