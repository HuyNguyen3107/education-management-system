import { toast, type ToastOptions } from "react-toastify";

const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

/**
 * Chuẩn hóa nội dung thông báo lỗi từ API sang tiếng Việt, dễ hiểu cho người dùng.
 * Ưu tiên message từ backend (response.data.message hoặc response.data là string),
 * nếu không có thì dùng fallback tiếng Việt.
 */
export const getErrorMessage = (error: any, fallback: string): string => {
  if (!error) return fallback;

  const responseData = error.response?.data;

  const serverMessage =
    (typeof responseData === "string" ? responseData : responseData?.message) ??
    null;

  if (serverMessage) {
    return serverMessage;
  }

  if (error.message === "Network Error") {
    return "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.";
  }

  return fallback;
};

/**
 * Thông báo thành công (tiếng Việt)
 */
export const showSuccessToast = (message: string, options?: ToastOptions) => {
  toast.success(message, {
    ...defaultOptions,
    ...options,
  });
};

/**
 * Thông báo lỗi (tiếng Việt)
 */
export const showErrorToast = (message: string, options?: ToastOptions) => {
  toast.error(message, {
    ...defaultOptions,
    ...options,
  });
};

/**
 * Thông báo cảnh báo (tiếng Việt)
 */
export const showWarningToast = (message: string, options?: ToastOptions) => {
  toast.warning(message, {
    ...defaultOptions,
    ...options,
  });
};

/**
 * Thông báo thông tin (tiếng Việt)
 */
export const showInfoToast = (message: string, options?: ToastOptions) => {
  toast.info(message, {
    ...defaultOptions,
    ...options,
  });
};

/**
 * Thông báo lỗi chuẩn từ API với fallback tiếng Việt.
 */
export const showApiErrorToast = (
  error: any,
  fallback: string,
  options?: ToastOptions
) => {
  const message = getErrorMessage(error, fallback);
  showErrorToast(message, options);
};

/**
 * Thông báo tùy ý (success, error, warning, info) – nội dung nên là tiếng Việt.
 */
export const showToast = (
  message: string,
  type: "success" | "error" | "warning" | "info" = "info",
  options?: ToastOptions
) => {
  toast[type](message, {
    ...defaultOptions,
    ...options,
  });
};
