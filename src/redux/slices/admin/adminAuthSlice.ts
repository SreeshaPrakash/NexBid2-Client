import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface User {
  role: string;
  id: string;
  email: string;
  name: string;
  roles: string[];
  activeRole?: string;
}

interface AdminAuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  activeRole: string | null;
}

const storedAdminUser = localStorage.getItem('adminUser');
const storedAdminToken = localStorage.getItem('adminAccessToken');

const initialState: AdminAuthState = {
  user: storedAdminUser ? JSON.parse(storedAdminUser) : null,
  accessToken: storedAdminToken || null,
  isAuthenticated: !!storedAdminToken && !!storedAdminUser,
  activeRole: localStorage.getItem('adminActiveRole') || null,
};

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    setAdminCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      const role = action.payload.user.activeRole || "admin";
      state.activeRole = role;

      localStorage.setItem('adminAccessToken', action.payload.accessToken);
      localStorage.setItem('adminUser', JSON.stringify(action.payload.user));
      localStorage.setItem('adminActiveRole', role);
    },
    adminLogout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.activeRole = null;

      localStorage.removeItem('adminAccessToken');
      localStorage.removeItem('adminUser');
      localStorage.removeItem('adminActiveRole');
    },
    updateAdminUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('adminUser', JSON.stringify(state.user));
      }
    },
  },
});

export const { setAdminCredentials, adminLogout, updateAdminUser } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
