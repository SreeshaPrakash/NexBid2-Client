export const UserRoute = {
  LANDING: "/",
  HOME: "/home",
  SIGNUP: "/signup",
  LOGIN: "/login",
  ADMIN_LOGIN: "/admin/login",
  VERIFY_OTP: "/verify-otp",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
} as const;

export const AdminRoute = {
  DASHBOARD: "/admin/dashboard",
} as const;

export const FreelancerRoute = {
  HOME: "home",
  PROFILE: "freelancer/profile",
  PROFILE_SETUP: "freelancer/profile/setup",
  PROFILE_EDIT: "freelancer/profile/edit",
} as const;

export const ClientRoute = {
  HOME: "home",
  PROFILE: "client/profile",
  PROFILE_EDIT: "client/profile/edit",
} as const;