// src/routes/commonRoutes.tsx
// import Unauthorized from "../pages/Unauthorized";
import LandingPage from "../pages/common/LandingPage";
import HomePage from "../pages/common/HomePage";
import SignupPage from "../pages/auth/SignupPage";
import LoginPage from "../pages/auth/LoginPage";
import AdminLoginPage from "../pages/auth/AdminLoginPage";
import VerifyOtpPage from "../pages/auth/VerifyOtpPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import Unauthorized from "../pages/common/Unauthorized";

export const commonRoutes = [
  { path: "/", element: <LandingPage /> },
  { path: "/home", element: <HomePage /> },
  { path: "/signup", element: <SignupPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/admin/login", element: <AdminLoginPage /> },
  { path: "/verify-otp", element: <VerifyOtpPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/reset-password", element: <ResetPasswordPage /> },
  { path: "/unauthorized", element: <Unauthorized/> },
];
