

import AdminFreelancerProfile from "../pages/admin/AdminFreelancerProfile";
import Dashboard from "../pages/admin/Dashboard";

export const adminRoutes = [

  { path: "/admin/dashboard", element: <Dashboard />   },
  { path: "/admin/freelancer-profile/:id", element: <AdminFreelancerProfile /> },


];



