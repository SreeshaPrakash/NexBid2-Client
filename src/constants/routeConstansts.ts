export const UserRoute = {
  LANDING: "/",
  HOME: "/home",
  SIGNUP: "/signup",
  LOGIN: "/login",
  ADMIN_LOGIN: "/admin/login",
  VERIFY_OTP: "/verify-otp",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  UNAUTHORIZED: "/unauthorized",
} as const;

export const AdminRoute = {
  DASHBOARD: "/admin/dashboard",
  FREELANCER_PROFILE: "/admin/freelancer-profile/:id",
  LOGOUT: "/admin/logout"
} as const;

export const FreelancerRoute = {
  HOME: "/freelancer/home",
  PROFILE: "/freelancer/profile",
  PROFILE_SETUP: "/freelancer/profile/setup",
  PROFILE_EDIT: "/freelancer/profile/edit",
} as const;

export const ClientRoute = {
  HOME: "/home",
  PROFILE: "/client/profile",
  PROFILE_EDIT: "/client/profile/edit",
  BIDS: "/client/bids",
  MESSAGES: "/client/messages",
  SETTINGS: "/client/settings",
} as const;

export const ProjectRoute = {
  CREATE: "/client/projects/create",
  MY_PROJECTS: "/client/projects/list",
  EDIT: "/client/projects/edit/:projectId",
  OPEN_PROJECTS: "/freelancer/projects/open",
  CLIENT_DETAILS: "/client/projects/:projectId",
  FREELANCER_DETAILS: "/freelancer/projects/:projectId",
  DETAILS: "/projects/:projectId/details",
  PROPOSALS: "/projects/:projectId/proposals",
} as const;