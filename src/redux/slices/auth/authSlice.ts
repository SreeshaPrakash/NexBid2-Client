import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  activeRole?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  activeRole: string | null;
  hasFreelancerProfile: boolean | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  activeRole: localStorage.getItem('activeRole') || null,
  hasFreelancerProfile: localStorage.getItem('hasFreelancerProfile') === 'true' ? true :
    localStorage.getItem('hasFreelancerProfile') === 'false' ? false : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      const role = action.payload.user.activeRole || "client";
      state.activeRole = role;
      localStorage.setItem('activeRole', role);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.activeRole = null;
      state.hasFreelancerProfile = null;
      localStorage.removeItem('activeRole');
      localStorage.removeItem('hasFreelancerProfile');
    },
    setActiveRole: (state, action: PayloadAction<{ role: string, hasProfile?: boolean, accessToken?: string }>) => {
      const role = action.payload.role;
      state.activeRole = role;

      if (action.payload.accessToken) {
        state.accessToken = action.payload.accessToken;
        localStorage.setItem('accessToken', action.payload.accessToken);
      }

      if (action.payload.hasProfile !== undefined) {
        state.hasFreelancerProfile = action.payload.hasProfile;
        localStorage.setItem('hasFreelancerProfile', String(action.payload.hasProfile));
      }
      if (state.user) {
        state.user.activeRole = role;
      }
      localStorage.setItem('activeRole', role);
    },
  },
});

export const { setCredentials, logout, setActiveRole } = authSlice.actions;
export default authSlice.reducer;
