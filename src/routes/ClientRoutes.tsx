
// src/routes/clientRoutes.tsx
import Dashboard from "../pages/Dashboard";
import ClientPage from "../pages/ClientPage";

export const clientRoutes = [
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/client", element: <ClientPage /> },
];
