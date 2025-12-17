import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { ROUTE_PATHS } from "@/constants/route-path.constants";

export const AuthGuard = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTE_PATHS.LOGIN} replace />;
  }

  const role = user?.role;
  const path = location.pathname;

  // Nếu chưa có thông tin vai trò thì cho qua (đề phòng trường hợp dữ liệu chưa kịp hydrate)
  if (!role) {
    return <Outlet />;
  }

  // STUDENT: không được truy cập /dashboard hoặc /lecturer
  if (
    role === "STUDENT" &&
    (path.startsWith(ROUTE_PATHS.DASHBOARD) ||
      path.startsWith(ROUTE_PATHS.LECTURER_HOME))
  ) {
    return <Navigate to={ROUTE_PATHS.PUBLIC_HOME} replace />;
  }

  // LECTURER: không được truy cập /dashboard (chỉ dùng khu vực /lecturer)
  if (role === "LECTURER" && path.startsWith(ROUTE_PATHS.DASHBOARD)) {
    return <Navigate to={ROUTE_PATHS.LECTURER_HOME} replace />;
  }

  // ADMIN (hoặc role khác): truy cập được tất cả
  return <Outlet />;
};
