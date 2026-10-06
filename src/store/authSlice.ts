import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthUser, AuthState } from "@/types/auth/auth.types";

const initialState: AuthState = {
  accessToken: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
    setAuthUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
    },
    clearAuth(state) {
      state.accessToken = null;
      state.user = null;
    },
  },
});

export const { setAccessToken, setAuthUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;
