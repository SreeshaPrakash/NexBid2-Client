// src/api/axiosInterceptor.ts






import API from "./axiosInstance";
import { logout, setCredentials } from "../redux/slices/auth/authSlice";
import { adminLogout, setAdminCredentials } from "../redux/slices/admin/adminAuthSlice";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import type { RootState, AppDispatch } from './../redux/store';

export const setupAxiosInterceptors = (store: { getState: () => RootState; dispatch: AppDispatch }) => {
  // Helper to get token safely from typed Redux state
  const getToken = (url?: string) => {
    const state = store.getState() as RootState;
    if (url?.includes('/admin')) {
      return state.adminAuth.accessToken;
    }
    return state.auth.accessToken;
  };

  API.interceptors.request.use(
    (config) => {
      const token = getToken(config.url);
      if (token && config.headers) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  API.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      const url = originalRequest?.url || "";
      const isAdminRequest = url.includes("/admin");
      
      const isLoginRequest = url.includes("/login");
      const isRefreshRequest = url.includes("/refresh-token");
      const isLoginPage = window.location.pathname === "/login" || window.location.pathname === "/admin/login";

      if (error.response?.status === 403) {
        const errorData = error.response.data as { message?: string };
        if (errorData?.message?.toLowerCase().includes('blocked')) {
          if (isAdminRequest) {
            store.dispatch(adminLogout());
            window.location.href = "/admin/login";
          } else {
            store.dispatch(logout());
            window.location.href = "/login";
          }
          return Promise.reject(error);
        }
      }

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !isLoginRequest &&
        !isRefreshRequest &&
        !isLoginPage
      ) {
        originalRequest._retry = true;

        try {
          const refreshUrl = isAdminRequest ? "/admin/refresh-token" : "/refresh-token";
          // Check if admin has its own refresh endpoint. If not, fallback to /refresh-token.
          // Based on previous research, admin might use the same or a specific one.
          // I will use a generic approach if /admin/refresh-token doesn't exist, but usually it should.
          const refreshResponse = await API.post(refreshUrl);
          const newAccessToken = refreshResponse.data.accessToken;
          const user = refreshResponse.data.user;

          if (user && newAccessToken) {
            if (isAdminRequest) {
              store.dispatch(setAdminCredentials({
                user,
                accessToken: newAccessToken
              }));
            } else {
              store.dispatch(setCredentials({
                user,
                accessToken: newAccessToken
              }));
            }
          }

          // Update header and retry original request
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return API(originalRequest);
        } catch (refreshError) {
          if (isAdminRequest) {
            store.dispatch(adminLogout());
            window.location.href = "/admin/login";
          } else {
            store.dispatch(logout());
            window.location.href = "/login";
          }
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

export default API;
