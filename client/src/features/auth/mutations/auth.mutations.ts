import { useMutation } from "@tanstack/react-query";
import { login, logout } from "../services/auth.services";
import type { LoginRequest, LoginResponse } from "../types/auth.types";
import { useAuthStore } from "@/store/auth.store";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "@/constants/route-path.constants";

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
