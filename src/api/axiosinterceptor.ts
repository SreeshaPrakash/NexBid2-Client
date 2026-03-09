// src/api/axiosInterceptor.ts






import API from "./axiosInstance";
import { logout, setCredentials } from "../redux/slices/auth/authSlice";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import type { RootState, AppDispatch } from './../redux/store';

export const setupAxiosInterceptors = (store: { getState: () => RootState; dispatch: AppDispatch }) => {
  // Helper to get token safely from typed Redux state
  const getToken = () => (store.getState() as RootState).auth.accessToken;

  API.interceptors.request.use(
    (config) => {
      const token = getToken();
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

      const isLoginRequest = originalRequest?.url?.includes("/login");
      const isRefreshRequest = originalRequest?.url?.includes("/refresh-token");
      const isLoginPage = window.location.pathname === "/login";

      if (error.response?.status === 403) {
        const errorData = error.response.data as any;
        if (errorData?.message?.toLowerCase().includes('blocked')) {
          store.dispatch(logout());
          window.location.href = "/login";
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
          const refreshResponse = await API.post("/refresh-token");
          const newAccessToken = refreshResponse.data.accessToken;
          const user = refreshResponse.data.user;

          if (user && newAccessToken) {
            store.dispatch(setCredentials({
              user,
              accessToken: newAccessToken
            }));
          }

          // Update header and retry original request
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return API(originalRequest);
        } catch (refreshError) {
          store.dispatch(logout());
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};


export default API;
