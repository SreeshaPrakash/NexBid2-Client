// src/routes/RoleProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

interface RoleProtectedRouteProps {
  allowedRoles: string[]; // e.g., ["admin", "client"]
}

const RoleProtectedRoute = ({ allowedRoles }: RoleProtectedRouteProps) => {
  const userRoles = useSelector(
    (state: RootState) => state.auth.user?.roles || []
  );

  const hasAccess = userRoles.some((role) => allowedRoles.includes(role));

  if (!hasAccess) {
    return <Navigate to="/unauthorized" replace />; // optional unauthorized page
  }

  return <Outlet />;
};

export default RoleProtectedRoute;
