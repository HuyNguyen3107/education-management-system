import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { ROUTE_PATHS } from "@/constants/route-path.constants";

const LoginPage = lazy(() =>
  import("../pages/login.page").then((module) => ({
    default: module.LoginPage,
  }))
);

const ForgotPasswordPage = lazy(() =>
  import("../pages/forgot-password.page").then((module) => ({
    default: module.ForgotPasswordPage,
  }))
);

const ResetPasswordPage = lazy(() =>
  import("../pages/reset-password.page").then((module) => ({
    default: module.ResetPasswordPage,
  }))
);

export const authRoutes: RouteObject[] = [
  {
    path: ROUTE_PATHS.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTE_PATHS.FORGOT_PASSWORD,
    element: <ForgotPasswordPage />,
  },
  {
    path: ROUTE_PATHS.RESET_PASSWORD,
    element: <ResetPasswordPage />,
  },
];
