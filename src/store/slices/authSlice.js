import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  user: null,
  email: '',
  otp: '',
  isLoading: false,
  error: null,
  isAuthenticated: false,
  otpSent: false,
  loginStep: 1, // 1: Enter email, 2: Enter OTP
};

// Create slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set email
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    
    // Set OTP
    setOTP: (state, action) => {
      state.otp = action.payload;
    },
    
    // Mark OTP as sent
    setOTPSent: (state, action) => {
      state.otpSent = action.payload;
    },
    
    // Set login step
    setLoginStep: (state, action) => {
      state.loginStep = action.payload;
    },
    
    // Set loading state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    // Set error
    setError: (state, action) => {
      state.error = action.payload;
    },
    
    // Login successful
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    
    // Logout
    logout: (state) => {
      state.user = null;
      state.email = '';
      state.otp = '';
      state.isAuthenticated = false;
      state.otpSent = false;
      state.loginStep = 1;
      state.error = null;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

// Export actions
export const {
  setEmail,
  setOTP,
  setOTPSent,
  setLoginStep,
  setLoading,
  setError,
  loginSuccess,
  logout,
  clearError,
} = authSlice.actions;

// Export reducer
export default authSlice.reducer;