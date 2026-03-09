
// src/routes/clientRoutes.tsx

// import Dashboard from "../pages/admin/Dashboard";
// import ClientPage from "../pages/ClientPage";
import ClientDashboard from "../components/client/ClientDashboard";
import ClientProfile from "../pages/client/ClientProfile";
import ClientProfileForm from "../pages/client/ClientProfileForm";
import ClientLayout from "../layouts/ClientLayout";

export const clientRoutes = [
  {
    path: "home",
    element: (
      <ClientLayout>
        <ClientDashboard />
      </ClientLayout>
    )
  },
  {
    path: "client/profile",
    element: (
      <ClientLayout>
        <ClientProfile />
      </ClientLayout>
    )
  },
  { path: "client/profile/edit", element: <ClientProfileForm /> },
];
