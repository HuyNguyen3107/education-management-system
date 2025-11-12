import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { ROUTE_PATHS } from "@/constants/route-path.constants";

const LoginPage = lazy(() =>
  import("../pages/login.page").then((module) => ({
    default: module.LoginPage,
  }))
);

export const authRoutes: RouteObject[] = [
  {
    path: ROUTE_PATHS.LOGIN,
    element: <LoginPage />,
  },
];
