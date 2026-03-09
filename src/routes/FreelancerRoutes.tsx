import React from "react";
import FreelancerDashboard from "../components/freelancer/FreelancerDashboard";
import FreelancerProfile from "../pages/freelancer/FreelancerProfile";
import FreelancerProfileForm from "../pages/freelancer/FreelancerProfileForm";
import FreelancerLayout from "../layouts/FreelancerLayout"; 

export const freelancerRoutes = [
  {
    path: "home",
    element: (
      <FreelancerLayout>
        <FreelancerDashboard />
      </FreelancerLayout>
    )
  },
  {
    path: "freelancer/profile",
    element: (
      <FreelancerLayout>
        <FreelancerProfile />
      </FreelancerLayout>
    )
  },
  { path: "freelancer/profile/setup", element: <FreelancerProfileForm /> },
  { path: "freelancer/profile/edit", element: <FreelancerProfileForm /> },
];
