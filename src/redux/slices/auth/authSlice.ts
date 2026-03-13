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

const storedUser = localStorage.getItem('user');
const storedToken = localStorage.getItem('accessToken');

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  accessToken: storedToken || null,
  isAuthenticated: !!storedToken && !!storedUser,
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

      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('activeRole', role);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.activeRole = null;
      state.hasFreelancerProfile = null;

      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      localStorage.removeItem('activeRole');
      localStorage.removeItem('hasFreelancerProfile');
    },
    setActiveRole: (state, action: PayloadAction<{ role: string, hasProfile?: boolean, accessToken?: string, user?: User }>) => {
      const role = action.payload.role;
      state.activeRole = role;
      localStorage.setItem('activeRole', role);

      if (action.payload.accessToken) {
        state.accessToken = action.payload.accessToken;
        localStorage.setItem('accessToken', action.payload.accessToken);
      }

      if (action.payload.user) {
        state.user = action.payload.user;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      } else if (state.user && !state.user.roles.includes(role)) {
        // Fallback: If no user object is provided, ensure the new role is at least in the roles array
        // This prevents unauthorized errors when switching to a first-time role
        state.user.roles = [...state.user.roles, role];
        localStorage.setItem('user', JSON.stringify(state.user));
      }

      if (action.payload.hasProfile !== undefined) {
        state.hasFreelancerProfile = action.payload.hasProfile;
        localStorage.setItem('hasFreelancerProfile', String(action.payload.hasProfile));
      }
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
  },
});

export const { setCredentials, logout, setActiveRole, updateUser } = authSlice.actions;
export default authSlice.reducer;
