import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { ROUTE_PATHS } from "@/constants/route-path.constants";

// Guard cho khu vực /public:
// - Yêu cầu đăng nhập cho tất cả các trang /public
// - LECTURER: nếu là Lecturer thì chuyển về /lecturer
export const PublicGuard = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());

  // Nếu chưa đăng nhập -> chuyển về trang login
  if (!isAuthenticated) {
    return <Navigate to={ROUTE_PATHS.LOGIN} replace />;
  }

  // Nếu role là LECTURER -> chuyển về trang lecturer
  if (user?.role === "LECTURER") {
    return <Navigate to={ROUTE_PATHS.LECTURER_HOME} replace />;
  }

  return <Outlet />;
};
