
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { UserRoute } from "../constants/routeConstansts";

const ProtectedRoute = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  if (!isAuthenticated) {
    return <Navigate to={UserRoute.LOGIN} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
