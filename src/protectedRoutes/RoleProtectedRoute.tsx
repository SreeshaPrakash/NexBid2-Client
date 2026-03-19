// src/routes/RoleProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

interface RoleProtectedRouteProps {
  allowedRoles: string[]; // e.g., ["admin", "client"]
}

const RoleProtectedRoute = ({ allowedRoles }: RoleProtectedRouteProps) => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  // If we are not authenticated at all, the ProtectedRoute wrapper should handle redirect to login
  // This component handles the *role* check once authenticated.
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const userRoles = user?.roles || (user?.roles ? [user.role] : []);
  const hasAccess = userRoles.some((role: string) => allowedRoles.includes(role));

  if (!hasAccess) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default RoleProtectedRoute;




























// import { Navigate, Outlet } from "react-router-dom";
// import { useSelector } from "react-redux";
// import type { RootState } from "../redux/store";

// interface RoleProtectedRouteProps {
//   allowedRoles: string[]; // e.g., ["admin", "client"]
// }

// const RoleProtectedRoute = ({ allowedRoles }: RoleProtectedRouteProps) => {
//   const userRoles = useSelector(
//     (state: RootState) => state.auth.user?.roles || []
//   );

//   const hasAccess = userRoles.some((role) => allowedRoles.includes(role));

//   if (!hasAccess) {
//     return <Navigate to="/unauthorized" replace />; // optional unauthorized page
//   }

//   return <Outlet />;
// };

// export default RoleProtectedRoute;
