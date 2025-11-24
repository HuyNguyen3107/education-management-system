export const API_BASE_URL = "http://localhost:8080/api";

export const API_PATHS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
  },
  PASSWORD_RESET: {
    REQUEST: "/password-reset/request",
    VALIDATE: "/password-reset/validate",
    SUBMIT: "/password-reset/submit",
  },
} as const;
