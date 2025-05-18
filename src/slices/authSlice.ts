import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Strongly type the user object for better type safety
export interface AuthUser {
  id: string;
  email: string;
  username?: string;
  fullName?: string;
  avatarUrl?: string;
  role?: string;
  // Add more fields as needed
}

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  registrationSuccess: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  registrationSuccess: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setRegistrationSuccess(state, action: PayloadAction<boolean>) {
      state.registrationSuccess = action.payload;
    },
    resetAuthState(state) {
      state.error = null;
      state.registrationSuccess = false;
    },
  },
});

export const { setLoading, setUser, setError, setRegistrationSuccess, resetAuthState } = authSlice.actions;
export default authSlice.reducer;
