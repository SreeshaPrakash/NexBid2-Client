
import FreelancerDashboard from "../components/freelancer/FreelancerDashboard";
import FreelancerProfile from "../pages/freelancer/FreelancerProfile";
import FreelancerProfileForm from "../pages/freelancer/FreelancerProfileForm";
import FreelancerLayout from "../layouts/FreelancerLayout";
import ProjectMarketplace from "../pages/freelancer/ProjectMarketplace";
import { ProjectRoute, FreelancerRoute } from "../constants/routeConstansts";
import { Navigate } from "react-router-dom";

export const freelancerRoutes = [
  {
    path: FreelancerRoute.HOME,
    element: (
      <FreelancerLayout>
        <FreelancerDashboard />
      </FreelancerLayout>
    )
  },
  {
    path: FreelancerRoute.PROFILE,
    element: (
      <FreelancerLayout>
        <FreelancerProfile />
      </FreelancerLayout>
    )
  },
  { path: FreelancerRoute.PROFILE_SETUP, element: <FreelancerProfileForm /> },
  { path: FreelancerRoute.PROFILE_EDIT, element: <FreelancerProfileForm /> },
  {
    path: ProjectRoute.OPEN_PROJECTS,
    element: (
      <FreelancerLayout>
        <ProjectMarketplace />
      </FreelancerLayout>
    )
  },
  {
    path: ProjectRoute.FREELANCER_DETAILS,
    element: <Navigate to="details" replace />
  },
  
];
