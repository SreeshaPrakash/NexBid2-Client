
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./protectedRoutes/protectedRoute";
import RoleProtectedRoute from "./protectedRoutes/RoleProtectedRoute";

import { commonRoutes } from "./routes/commonRoutes";
import { adminRoutes } from "./routes/AdminRoutes";
// import { clientRoutes } from "./routes/clientRoutes";
// import { freelancerRoutes } from "./routes/freelancerRoutes";

import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      <Toaster position="top-center" />
      <Routes>
        {/* Common/Public routes */}
        {commonRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
        {/* Admin routes */}
        <Route element={<RoleProtectedRoute allowedRoles={["admin"]} />}>
            {adminRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Route>

        {/* Client routes */}
        {/* <Route element={<RoleProtectedRoute allowedRoles={["client"]} />}>
            {clientRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Route> */}

        {/* Freelancer routes */}
        {/* <Route element={<RoleProtectedRoute allowedRoles={["freelancer"]} />}>
            {freelancerRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Route> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
