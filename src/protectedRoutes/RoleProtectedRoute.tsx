import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

interface RoleProtectedRouteProps {
  allowedRoles: string[];
}

const RoleProtectedRoute = ({ allowedRoles }: RoleProtectedRouteProps) => {
  const { user, isAuthenticated, activeRole } = useSelector((state: RootState) => state.auth);

  const [isRedirecting, setIsRedirecting] = useState(false);

  // Fallback chain: state.activeRole → user.role → user.roles[0]
  // Handles old sessions where activeRole may not be in localStorage yet
  const currentRole = activeRole || user?.role || user?.roles?.[0] || "";
  const hasAccess = allowedRoles.includes(currentRole);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (!hasAccess && isAuthenticated) {
      // Small debounce before throwing to unauthorized.
      // This allows role switching navigations (e.g., to /home) to take precedence 
      // before this component can unfairly boot the user out due to Redux state race conditions.
      timeoutId = setTimeout(() => {
        setIsRedirecting(true);
      }, 50);
    } else {
      setIsRedirecting(false);
    }
    return () => clearTimeout(timeoutId);
  }, [hasAccess, isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasAccess) {
    return isRedirecting ? <Navigate to="/unauthorized" replace /> : null;
  }

  return <Outlet />;
};

export default RoleProtectedRoute;
