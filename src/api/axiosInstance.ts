// src/api/axiosInstance.ts
import axios from "axios";
import type { AxiosInstance } from "axios";

const API: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
