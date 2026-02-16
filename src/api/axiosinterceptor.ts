// src/api/axiosInterceptor.ts
import API from "./axiosInstance";
import { store } from "../redux/store";
import { logout } from "../redux/slices/auth/authSlice";
import type { AxiosError } from "axios";
import type { RootState } from './../redux/store';


// Helper to get token safely from typed Redux state
const getToken = () => (store.getState() as RootState).auth.accessToken;

// REQUEST INTERCEPTOR
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

// RESPONSE INTERCEPTOR
API.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;
