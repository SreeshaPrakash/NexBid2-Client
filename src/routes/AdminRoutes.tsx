
// src/routes/adminRoutes.tsx
import Dashboard from "../pages/admin/Dashboard";
import AdminPage from "../pages/admin/AdminPage";

export const adminRoutes = [
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/admin", element: <AdminPage /> },
];

