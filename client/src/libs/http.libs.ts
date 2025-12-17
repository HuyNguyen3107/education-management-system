import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { API_BASE_URL } from "@/constants/api-path.constants";
import { useAuthStore } from "@/store/auth.store";
import { showWarningToast } from "@/libs/toast.libs";

// Create axios instance
export const http = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

let isHandlingUnauthorized = false;

// Response interceptor for error handling
http.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && !isHandlingUnauthorized) {
      isHandlingUnauthorized = true;

      // Clear auth state
      useAuthStore.getState().clearAuth();

      // Show session expired notification
      showWarningToast("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");

      // Redirect to login page
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
