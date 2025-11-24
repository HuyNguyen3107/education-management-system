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
 * Show success toast notification
 * @param message - Message to display (supports Vietnamese)
 * @param options - Custom toast options
 */
export const showSuccessToast = (message: string, options?: ToastOptions) => {
  toast.success(message, {
    ...defaultOptions,
    ...options,
  });
};

/**
 * Show error toast notification
 * @param message - Message to display (supports Vietnamese)
 * @param options - Custom toast options
 */
export const showErrorToast = (message: string, options?: ToastOptions) => {
  toast.error(message, {
    ...defaultOptions,
    ...options,
  });
};

/**
 * Show warning toast notification
 * @param message - Message to display (supports Vietnamese)
 * @param options - Custom toast options
 */
export const showWarningToast = (message: string, options?: ToastOptions) => {
  toast.warning(message, {
    ...defaultOptions,
    ...options,
  });
};

/**
 * Show info toast notification
 * @param message - Message to display (supports Vietnamese)
 * @param options - Custom toast options
 */
export const showInfoToast = (message: string, options?: ToastOptions) => {
  toast.info(message, {
    ...defaultOptions,
    ...options,
  });
};

/**
 * Show custom toast notification
 * @param message - Message to display (supports Vietnamese)
 * @param type - Toast type (success, error, warning, info)
 * @param options - Custom toast options
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
