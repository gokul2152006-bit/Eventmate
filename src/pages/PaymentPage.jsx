import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Paper,
  Divider,
  Alert,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  ArrowBack,
  CreditCard,
  AccountBalance,
  QrCode,
  Lock,
  Visibility,
  VisibilityOff,
  CheckCircle,
  Receipt,
  Print,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addBooking } from '../store/slices/bookingSlice';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: user?.name || '',
  });
  const [upiId, setUpiId] = useState('');
  const [showCvv, setShowCvv] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  // Get booking details from location state or localStorage
  useEffect(() => {
    const detailsFromState = location.state?.bookingDetails;
    const detailsFromStorage = localStorage.getItem('currentBooking');
    
    if (detailsFromState) {
      setBookingDetails(detailsFromState);
    } else if (detailsFromStorage) {
      setBookingDetails(JSON.parse(detailsFromStorage));
    } else {
      navigate('/events');
    }
  }, [location, navigate]);

  const handleCardChange = (field) => (e) => {
    let value = e.target.value;
    
    // Format card number
    if (field === 'cardNumber') {
      value = value.replace(/\D/g, '').slice(0, 16);
      value = value.replace(/(\d{4})/g, '$1 ').trim();
    }
    
    // Format expiry
    if (field === 'expiry') {
      value = value.replace(/\D/g, '').slice(0, 4);
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2);
      }
    }
    
    // Format CVV
    if (field === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 3);
    }
    
    setCardDetails(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (paymentMethod === 'creditCard') {
      if (!cardDetails.cardNumber || cardDetails.cardNumber.replace(/\s/g, '').length !== 16) {
        return 'Please enter a valid 16-digit card number';
      }
      if (!cardDetails.expiry || !/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
        return 'Please enter a valid expiry date (MM/YY)';
      }
      if (!cardDetails.cvv || cardDetails.cvv.length !== 3) {
        return 'Please enter a valid CVV';
      }
      if (!cardDetails.name) {
        return 'Please enter cardholder name';
      }
    }
    
    if (paymentMethod === 'upi') {
      if (!upiId || !/^[\w.-]+@[\w.-]+$/.test(upiId)) {
        return 'Please enter a valid UPI ID';
      }
    }
    
    return null;
  };

  const handlePayment = () => {
    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }

    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // Generate booking ID
      const bookingId = 'BK' + Date.now().toString().slice(-8);
      const transactionId = 'TXN' + Date.now().toString().slice(-10);
      
      // Create complete booking object
      const completeBooking = {
        id: bookingId,
        ...bookingDetails,
        paymentMethod: paymentMethod,
        paymentStatus: 'completed',
        transactionId: transactionId,
        bookingDate: new Date().toISOString(),
        bookingStatus: 'confirmed',
        userEmail: user?.email || '',
        userName: user?.name || '',
      };
      
      // Save to Redux
      dispatch(addBooking(completeBooking));
      
      // Save to localStorage
      const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
      existingBookings.push(completeBooking);
      localStorage.setItem('userBookings', JSON.stringify(existingBookings));
      
      // Clear current booking
      localStorage.removeItem('currentBooking');
      
      setPaymentSuccess(true);
      setLoading(false);
      
      // Navigate to confirmation after 2 seconds
      setTimeout(() => {
        navigate('/confirmation', { 
          state: { 
            booking: completeBooking,
            eventTitle: location.state?.eventTitle,
            eventImage: location.state?.eventImage,
          }
        });
      }, 2000);
    }, 2000);
  };

  const handlePrintBill = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>EventMate - Booking Bill</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .bill-details { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #f2f2f2; }
            .total { font-weight: bold; font-size: 1.2em; }
            .footer { margin-top: 30px; text-align: center; font-size: 0.9em; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>EVENTMATE - BOOKING BILL</h2>
            <p>Date: ${new Date().toLocaleDateString()} | Time: ${new Date().toLocaleTimeString()}</p>
          </div>
          
          <div class="bill-details">
            <h3>Customer Details</h3>
            <p><strong>Name:</strong> ${user?.name || 'Guest'}</p>
            <p><strong>Email:</strong> ${user?.email || 'guest@example.com'}</p>
          </div>
          
          <div class="bill-details">
            <h3>Booking Details</h3>
            <p><strong>Event:</strong> ${bookingDetails?.eventTitle}</p>
            <p><strong>Date:</strong> ${bookingDetails?.date ? new Date(bookingDetails.date).toLocaleDateString() : ''}</p>
            <p><strong>Time:</strong> ${bookingDetails?.time}</p>
            <p><strong>Venue:</strong> ${bookingDetails?.venue}</p>
            ${bookingDetails?.seats ? `<p><strong>Seats:</strong> ${bookingDetails.seats.join(', ')}</p>` : ''}
            ${bookingDetails?.section ? `<p><strong>Section:</strong> ${bookingDetails.section}</p>` : ''}
            <p><strong>Tickets:</strong> ${bookingDetails?.ticketCount}</p>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${bookingDetails?.seats ? 'Movie Tickets' : 'Event Tickets'}</td>
                <td>${bookingDetails?.ticketCount}</td>
                <td>₹${bookingDetails?.pricePerTicket}</td>
                <td>₹${bookingDetails?.pricePerTicket * bookingDetails?.ticketCount}</td>
              </tr>
              <tr>
                <td>Convenience Fee</td>
                <td>${bookingDetails?.ticketCount}</td>
                <td>₹40</td>
                <td>₹${bookingDetails?.convenienceFee}</td>
              </tr>
              <tr class="total">
                <td colspan="3" style="text-align: right;">Total Amount:</td>
                <td>₹${bookingDetails?.totalPrice}</td>
              </tr>
            </tbody>
          </table>
          
          <div class="footer">
            <p>===================================</p>
            <p>Thank you for booking with EventMate!</p>
            <p>This is a computer-generated bill, no signature required.</p>
            <p>For any queries, contact: support@eventmate.com</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (!bookingDetails) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5">Loading booking details...</Typography>
      </Container>
    );
  }

  const steps = bookingDetails.bookingType === 'movie' 
    ? ['Select Showtime', 'Choose Seats', 'Payment', 'Confirmation']
    : ['Event Details', 'Select Tickets', 'Payment', 'Confirmation'];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
        variant="outlined"
      >
        Back
      </Button>

      {/* Stepper */}
      <Stepper activeStep={2} alternativeLabel sx={{ mb: 6 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {paymentSuccess ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2, boxShadow: 3 }}>
          <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 3 }} />
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Payment Successful!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Your tickets have been booked successfully. Redirecting to confirmation...
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={4}>
          {/* Left Column - Payment Form */}
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 3, mb: 4, borderRadius: 2, boxShadow: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Select Payment Method
              </Typography>
              
              <FormControl component="fieldset" sx={{ width: '100%', mb: 4 }}>
                <RadioGroup
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  {/* Credit Card Option */}
                  <Paper sx={{ mb: 2, p: 2, cursor: 'pointer', borderRadius: 2 }}>
                    <FormControlLabel
                      value="creditCard"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CreditCard sx={{ mr: 2, color: 'primary.main' }} />
                          <Typography variant="body1" fontWeight="medium">
                            Credit/Debit Card
                          </Typography>
                        </Box>
                      }
                      sx={{ width: '100%' }}
                    />
                    
                    {paymentMethod === 'creditCard' && (
                      <Box sx={{ mt: 3, pl: 4 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Card Number"
                              placeholder="1234 5678 9012 3456"
                              value={cardDetails.cardNumber}
                              onChange={handleCardChange('cardNumber')}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <Lock color="action" />
                                  </InputAdornment>
                                ),
                              }}
                              variant="outlined"
                            />
                          </Grid>
                          
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              label="Expiry Date"
                              placeholder="MM/YY"
                              value={cardDetails.expiry}
                              onChange={handleCardChange('expiry')}
                              variant="outlined"
                            />
                          </Grid>
                          
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              label="CVV"
                              type={showCvv ? 'text' : 'password'}
                              placeholder="123"
                              value={cardDetails.cvv}
                              onChange={handleCardChange('cvv')}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      onClick={() => setShowCvv(!showCvv)}
                                      edge="end"
                                    >
                                      {showCvv ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                              variant="outlined"
                            />
                          </Grid>
                          
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Cardholder Name"
                              placeholder="John Doe"
                              value={cardDetails.name}
                              onChange={handleCardChange('name')}
                              variant="outlined"
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    )}
                  </Paper>
                  
                  {/* UPI Option */}
                  <Paper sx={{ mb: 2, p: 2, cursor: 'pointer', borderRadius: 2 }}>
                    <FormControlLabel
                      value="upi"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <QrCode sx={{ mr: 2, color: 'primary.main' }} />
                          <Typography variant="body1" fontWeight="medium">
                            UPI
                          </Typography>
                        </Box>
                      }
                      sx={{ width: '100%' }}
                    />
                    
                    {paymentMethod === 'upi' && (
                      <Box sx={{ mt: 3, pl: 4 }}>
                        <TextField
                          fullWidth
                          label="UPI ID"
                          placeholder="username@upi"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          helperText="Enter your UPI ID (e.g., username@okaxis)"
                          variant="outlined"
                        />
                      </Box>
                    )}
                  </Paper>
                  
                  {/* Net Banking Option */}
                  <Paper sx={{ p: 2, cursor: 'pointer', borderRadius: 2 }}>
                    <FormControlLabel
                      value="netbanking"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AccountBalance sx={{ mr: 2, color: 'primary.main' }} />
                          <Typography variant="body1" fontWeight="medium">
                            Net Banking
                          </Typography>
                        </Box>
                      }
                      sx={{ width: '100%' }}
                    />
                  </Paper>
                </RadioGroup>
              </FormControl>
              
              <Alert severity="info">
                <Typography variant="body2">
                  <strong>Secure Payment:</strong> Your payment information is encrypted and secure.
                  We do not store any card details. All transactions are PCI DSS compliant.
                </Typography>
              </Alert>
            </Paper>
          </Grid>

          {/* Right Column - Bill Summary */}
          <Grid item xs={12} md={5}>
            <Paper sx={{ 
              p: 3, 
              position: 'sticky', 
              top: 20, 
              borderRadius: 2, 
              boxShadow: 3 
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" fontWeight="bold" sx={{ color: 'primary.main' }}>
                  Bill Summary
                </Typography>
                <Button
                  startIcon={<Print />}
                  onClick={handlePrintBill}
                  variant="outlined"
                  size="small"
                >
                  Print Bill
                </Button>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Booking Details */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Booking Details
                </Typography>
                <Typography variant="body1" fontWeight="medium" gutterBottom>
                  {bookingDetails.eventTitle}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">Date:</Typography>
                  <Typography variant="body2">
                    {new Date(bookingDetails.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Time:</Typography>
                  <Typography variant="body2">{bookingDetails.time}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Venue:</Typography>
                  <Typography variant="body2">{bookingDetails.venue}</Typography>
                </Box>
                
                {bookingDetails.seats && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Seats:</Typography>
                    <Typography variant="body2">{bookingDetails.seats.join(', ')}</Typography>
                  </Box>
                )}
                
                {bookingDetails.section && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Section:</Typography>
                    <Typography variant="body2">{bookingDetails.section}</Typography>
                  </Box>
                )}
              </Box>

              {/* Price Breakdown Table */}
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Qty</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        {bookingDetails.seats ? 'Movie Tickets' : 'Event Tickets'}
                      </TableCell>
                      <TableCell align="right">{bookingDetails.ticketCount}</TableCell>
                      <TableCell align="right">₹{bookingDetails.pricePerTicket}</TableCell>
                      <TableCell align="right">₹{bookingDetails.pricePerTicket * bookingDetails.ticketCount}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Convenience Fee</TableCell>
                      <TableCell align="right">{bookingDetails.ticketCount}</TableCell>
                      <TableCell align="right">₹40</TableCell>
                      <TableCell align="right">₹{bookingDetails.convenienceFee}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={3} align="right">
                        <Typography variant="subtitle1" fontWeight="bold">
                          Total Amount:
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="h6" color="primary" fontWeight="bold">
                          ₹{bookingDetails.totalPrice}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Tax Summary */}
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Includes all applicable taxes. No hidden charges.
                </Typography>
              </Box>

              {/* Pay Button */}
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handlePayment}
                disabled={loading}
                sx={{ 
                  mt: 3,
                  py: 1.5,
                  mb: 2,
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  background: 'linear-gradient(45deg, #3f51b5 30%, #757de8 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #002984 30%, #3f51b5 90%)',
                  }
                }}
              >
                {loading ? 'Processing Payment...' : `Pay ₹${bookingDetails.totalPrice}`}
              </Button>

              {/* Security Info */}
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mt: 2 }}>
                <Lock fontSize="small" color="action" />
                <Typography variant="caption" color="text.secondary">
                  256-bit SSL Secured • Verified Payment Gateway
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default PaymentPage;