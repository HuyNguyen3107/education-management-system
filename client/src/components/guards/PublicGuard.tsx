import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { ROUTE_PATHS } from "@/constants/route-path.constants";

// Guard cho khu vực /public:
// - LECTURER: bị chặn, chuyển về /lecturer
// - Các role khác (ADMIN, STUDENT, guest): được phép truy cập
export const PublicGuard = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());

  if (isAuthenticated && user?.role === "LECTURER") {
    return <Navigate to={ROUTE_PATHS.LECTURER_HOME} replace />;
  }

  return <Outlet />;
};
