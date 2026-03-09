
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./protectedRoutes/protectedRoute";
import RoleProtectedRoute from "./protectedRoutes/RoleProtectedRoute";

import { commonRoutes } from "./routes/commonRoutes";
import { adminRoutes } from "./routes/AdminRoutes";
import { clientRoutes } from "./routes/ClientRoutes";
import { freelancerRoutes } from "./routes/FreelancerRoutes";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import { usePersistLogin } from "./hooks/usePersistLogin";
import { setupAxiosInterceptors } from "./api/axiosinterceptor";
import { store } from "./redux/store";

// Initialize interceptors
setupAxiosInterceptors(store);

function App() {
  const { isLoading } = usePersistLogin();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Router>
        <Toaster position="top-center" />
        <Routes>
          {commonRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          <Route element={<ProtectedRoute />}>
            <Route element={<RoleProtectedRoute allowedRoles={["admin"]} />}>
              {adminRoutes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
            </Route>

            <Route element={<RoleProtectedRoute allowedRoles={["client"]} />}>
              {clientRoutes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
            </Route>

            <Route element={<RoleProtectedRoute allowedRoles={["freelancer"]} />}>
              {freelancerRoutes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
            </Route>
          </Route>
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
