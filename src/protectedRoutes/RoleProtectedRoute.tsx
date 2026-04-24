import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { UserRoute } from "../constants/routeConstansts";

interface RoleProtectedRouteProps {
  allowedRoles: string[];
}

const RoleProtectedRoute = ({ allowedRoles }: RoleProtectedRouteProps) => {
  const isAdminRoute = allowedRoles.includes("admin");
  const { user, isAuthenticated, activeRole } = useSelector((state: RootState) =>
    isAdminRoute ? state.adminAuth : state.auth
  );

  const [isRedirecting, setIsRedirecting] = useState(false);

  const currentRole = activeRole || user?.role || user?.roles?.[0] || "";
  const hasAccess = allowedRoles.includes(currentRole);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    if (!hasAccess && isAuthenticated) {
      // Small debounce before throwing to unauthorized.
      timeoutId = setTimeout(() => {
        setIsRedirecting(true);
      }, 50);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsRedirecting(prev => prev ? false : prev);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [hasAccess, isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to={isAdminRoute ? UserRoute.ADMIN_LOGIN : UserRoute.LOGIN} replace />;
  }

  if (!hasAccess) {
    return isRedirecting ? <Navigate to={UserRoute.UNAUTHORIZED} replace /> : null;
  }

  return <Outlet />;
};

export default RoleProtectedRoute;
