import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { ROUTE_PATHS } from "@/constants/route-path.constants";

export const GuestGuard = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());

  if (isAuthenticated) {
    return <Navigate to={ROUTE_PATHS.DASHBOARD} replace />;
  }

  return <Outlet />;
};
