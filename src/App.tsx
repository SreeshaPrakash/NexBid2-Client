
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./protectedRoutes/protectedRoute";
import RoleProtectedRoute from "./protectedRoutes/RoleProtectedRoute";

import { commonRoutes } from "./routes/commonRoutes";
import { adminRoutes } from "./routes/AdminRoutes";
import { clientRoutes } from "./routes/ClientRoutes";
import { freelancerRoutes } from "./routes/FreelancerRoutes";
import ProjectDetailLayout from "./layouts/ProjectDetailLayout";
import ProjectDetailWrapper from "./layouts/ProjectDetailWrapper";
import ProjectDetails from "./pages/common/ProjectDetails";
import ProjectProposals from "./pages/common/ProjectProposals";
import { Navigate } from "react-router-dom";

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
            {/* Admin Routes */}
            <Route element={<RoleProtectedRoute allowedRoles={["admin"]} />}>
              {adminRoutes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
            </Route>

            {/* Client Routes */}
            <Route element={<RoleProtectedRoute allowedRoles={["client"]} />}>
              {clientRoutes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
            </Route>

            {/* Freelancer Routes */}
            <Route element={<RoleProtectedRoute allowedRoles={["freelancer"]} />}>
              {freelancerRoutes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
            </Route>

            {/* Project Detail Routes (Shared) - Wrapped in Role-specific Layout */}
            <Route element={<ProjectDetailWrapper />}>
              <Route path="/projects/:projectId" element={<ProjectDetailLayout />}>
                <Route index element={<Navigate to="details" replace />} />
                <Route path="details" element={<ProjectDetails />} />
                <Route path="proposals" element={<ProjectProposals />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
