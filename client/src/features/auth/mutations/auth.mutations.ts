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

// Login Mutation
export const useLoginMutation = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: (response: LoginResponse) => {
      const { token, message, ...user } = response;
      setAuth(token, user);
      navigate(ROUTE_PATHS.DASHBOARD);
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
      navigate(ROUTE_PATHS.LOGIN);
    },
  });
};

// Password Reset Request Mutation
export const usePasswordResetRequestMutation = () => {
  return useMutation({
    mutationFn: (data: PasswordResetRequest) => requestPasswordReset(data),
  });
};

// Validate Token Mutation
export const useValidateTokenMutation = () => {
  return useMutation({
    mutationFn: (token: string) => validateToken(token),
  });
};

// Submit New Password Mutation
export const useSubmitNewPasswordMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => submitNewPassword(data),
    onSuccess: (response) => {
      if (response.success) {
        // Redirect to login after successful password reset
        setTimeout(() => {
          navigate(ROUTE_PATHS.LOGIN);
        }, 2000);
      }
    },
  });
};
