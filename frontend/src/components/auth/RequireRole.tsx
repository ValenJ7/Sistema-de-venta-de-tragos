import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppStore } from "../../store/useAppStore";
import type { UserRole } from "../../store/authSlice";

type RequireRoleProps = {
  roles: UserRole[];
  redirectTo?: string;
};

export function RequireRole({ roles, redirectTo = "/login" }: RequireRoleProps) {
  const location = useLocation();
  const user = useAppStore((s) => s.user);
  const token = useAppStore((s) => s.accessToken);

  const isLoggedIn = !!user && !!token;
  if (!isLoggedIn) {
    return <Navigate to={redirectTo} replace state={{ from: location.pathname }} />;
  }

  const allowed = roles.includes(user.role);
  if (!allowed) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
