import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  setEmail,
  setOTP,
  setOTPSent,
  setLoginStep,
  setLoading,
  setError,
  loginSuccess,
} from '../store/slices/authSlice';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get auth state from Redux
  const { email, otp, isLoading, error, otpSent, loginStep } = useSelector((state) => state.auth);
  
  // Local state for form inputs
  const [emailInput, setEmailInput] = useState(email || '');
  const [otpInput, setOtpInput] = useState('');

  // Simulate sending OTP
  const handleSendOTP = () => {
    if (!emailInput || !emailInput.includes('@')) {
      dispatch(setError('Please enter a valid email address'));
      return;
    }
    
    dispatch(setLoading(true));
    dispatch(setError(null));
    
    // Simulate API call
    setTimeout(() => {
      dispatch(setEmail(emailInput));
      dispatch(setOTPSent(true));
      dispatch(setLoginStep(2));
      dispatch(setLoading(false));
      
      // Generate mock OTP (in real app, this would come from backend)
      const mockOTP = Math.floor(100000 + Math.random() * 900000).toString();
      alert(`OTP sent to ${emailInput}: ${mockOTP}`); // For demo purposes
      dispatch(setOTP(mockOTP));
    }, 1500);
  };

  // Simulate OTP verification
  const handleVerifyOTP = () => {
    if (!otpInput || otpInput.length !== 6) {
      dispatch(setError('Please enter a valid 6-digit OTP'));
      return;
    }
    
    dispatch(setLoading(true));
    
    // Simulate API call
    setTimeout(() => {
      // For demo, accept any 6-digit OTP
      if (otpInput.length === 6) {
        const user = {
          email: emailInput,
          name: emailInput.split('@')[0],
          id: Date.now().toString(),
        };
        
        dispatch(loginSuccess(user));
        dispatch(setLoading(false));
        navigate('/');
      } else {
        dispatch(setError('Invalid OTP. Please try again.'));
        dispatch(setLoading(false));
      }
    }, 1500);
  };

  const steps = ['Enter Email', 'Verify OTP', 'Logged In'];

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        {/* Logo/Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
            EventMate
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Login to book your tickets
          </Typography>
        </Box>

        {/* Stepper */}
        <Stepper activeStep={loginStep - 1} alternativeLabel sx={{ mb: 6 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Step 1: Enter Email */}
        {loginStep === 1 && (
          <Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Enter Your Email
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              We'll send a one-time password (OTP) to your email
            </Typography>

            <TextField
              fullWidth
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              disabled={isLoading}
              sx={{ mb: 3 }}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleSendOTP}
              disabled={isLoading || !emailInput}
              sx={{ py: 1.5, mb: 2 }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Send OTP'
              )}
            </Button>

            <Typography variant="body2" color="text.secondary">
              By continuing, you agree to our Terms of Service & Privacy Policy
            </Typography>
          </Box>
        )}

        {/* Step 2: Enter OTP */}
        {loginStep === 2 && (
          <Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Enter OTP
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              We've sent a 6-digit OTP to <strong>{email}</strong>
            </Typography>

            <TextField
              fullWidth
              label="6-digit OTP"
              placeholder="123456"
              value={otpInput}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setOtpInput(value);
              }}
              disabled={isLoading}
              sx={{ mb: 3 }}
              inputProps={{
                maxLength: 6,
              }}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleVerifyOTP}
              disabled={isLoading || otpInput.length !== 6}
              sx={{ py: 1.5, mb: 2 }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Verify & Login'
              )}
            </Button>

            <Button
              fullWidth
              variant="text"
              onClick={() => {
                dispatch(setLoginStep(1));
                setOtpInput('');
              }}
              disabled={isLoading}
              sx={{ mb: 2 }}
            >
              Change Email
            </Button>

            <Typography variant="body2" color="text.secondary">
              Didn't receive OTP?{' '}
              <Button
                variant="text"
                size="small"
                onClick={handleSendOTP}
                disabled={isLoading}
              >
                Resend OTP
              </Button>
            </Typography>
          </Box>
        )}

        {/* Demo Info */}
        <Alert severity="info" sx={{ mt: 4 }}>
          <Typography variant="body2">
            <strong>Demo Instructions:</strong> Enter any email and click "Send OTP". 
            Check browser console for OTP. Enter that 6-digit code to login.
          </Typography>
        </Alert>
      </Paper>
    </Container>
  );
};

export default LoginPage;