import { useRoutes } from "react-router-dom";
import { authRoutes } from "@/features/auth/routes/auth.routes";
import { ROUTE_PATHS } from "@/constants/route-path.constants";
import { Navigate } from "react-router-dom";

export const AppRoutes = () => {
  const routes = useRoutes([
    {
      path: ROUTE_PATHS.HOME,
      element: <Navigate to={ROUTE_PATHS.LOGIN} replace />,
    },
    ...authRoutes,
    {
      path: ROUTE_PATHS.DASHBOARD,
      element: <div>Dashboard - Coming soon</div>,
    },
  ]);

  return routes;
};
