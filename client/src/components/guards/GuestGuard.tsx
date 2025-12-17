import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { ROUTE_PATHS } from "@/constants/route-path.constants";

export const GuestGuard = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const user = useAuthStore((state) => state.user);

  if (isAuthenticated) {
    const role = user?.role;

    if (role === "STUDENT") {
      return <Navigate to={ROUTE_PATHS.PUBLIC_HOME} replace />;
    }

    if (role === "LECTURER") {
      return <Navigate to={ROUTE_PATHS.LECTURER_HOME} replace />;
    }

    // ADMIN (hoặc role khác)
    return <Navigate to={ROUTE_PATHS.DASHBOARD} replace />;
  }

  return <Outlet />;
};
