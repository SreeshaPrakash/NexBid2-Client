
// src/routes/clientRoutes.tsx

import ClientDashboard from "../components/client/ClientDashboard";
import ClientProfile from "../pages/client/ClientProfile";
import ClientProfileForm from "../pages/client/ClientProfileForm";
import ClientLayout from "../layouts/ClientLayout";
import CreateProject from "../pages/client/CreateProject";
import MyProjects from "../pages/client/MyProjects";
import EditProject from "../pages/client/EditProject";
import { ProjectRoute, ClientRoute } from "../constants/routeConstansts";
import { Navigate } from "react-router-dom";

export const clientRoutes = [
  {
    path: ClientRoute.HOME,
    element: (
      <ClientLayout>
        <ClientDashboard />
      </ClientLayout>
    )
  },
  {
    path: ClientRoute.PROFILE,
    element: (
      <ClientLayout>
        <ClientProfile />
      </ClientLayout>
    )
  },
  { path: ClientRoute.PROFILE_EDIT, element: <ClientProfileForm /> },
  {
    path: ProjectRoute.CREATE,
    element: (
      <ClientLayout>
        <CreateProject />
      </ClientLayout>
    )
  },
  {
    path: ProjectRoute.MY_PROJECTS,
    element: (
      <ClientLayout>
        <MyProjects />
      </ClientLayout>
    )
  },
  {
    path: ProjectRoute.EDIT,
    element: (
      <ClientLayout>
        <EditProject />
      </ClientLayout>
    )
  },
   {
    path: ProjectRoute.CLIENT_DETAILS,
    element: <Navigate to="details" replace />
  },
  { path: ClientRoute.BIDS, element: <ClientLayout><h1 className="p-8 text-2xl font-bold">Bids Coming Soon...</h1></ClientLayout> },

];
