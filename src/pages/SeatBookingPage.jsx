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
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  ArrowBack,
  EventSeat,
  CheckCircle,
  Chair,
} from '@mui/icons-material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const SeatBookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showId } = useParams();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatingLayout, setSeatingLayout] = useState([]);
  const [event, setEvent] = useState(null);
  const [showtime, setShowtime] = useState(null);

  // Generate seating layout
  const generateSeatingLayout = (rows = 7, seatsPerRow = 10) => {
    const rowsArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G'].slice(0, rows);
    const layout = [];
    
    rowsArray.forEach(row => {
      const rowSeats = [];
      for (let i = 1; i <= seatsPerRow; i++) {
        const seatId = `${row}${i}`;
        // Randomly mark some seats as booked (30% chance)
        const isBooked = Math.random() < 0.3;
        const seatType = i <= 3 ? 'Premium' : i <= 7 ? 'Standard' : 'Economy';
        const seatPrice = showtime?.price || 350;
        
        rowSeats.push({
          id: seatId,
          row: row,
          number: i,
          isBooked: isBooked,
          price: seatType === 'Premium' ? seatPrice + 100 : 
                 seatType === 'Economy' ? seatPrice - 50 : seatPrice,
          type: seatType,
          color: seatType === 'Premium' ? 'warning.main' : 
                 seatType === 'Standard' ? 'primary.main' : 'success.main'
        });
      }
      layout.push({ row, seats: rowSeats });
    });
    
    return layout;
  };

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/booking/${showId}` } });
      return;
    }

    // Get event and showtime data
    const eventData = location.state?.event || JSON.parse(localStorage.getItem('movieBooking'));
    const showtimeData = location.state?.showtime;
    
    if (eventData) {
      setEvent(eventData);
      if (showtimeData) {
        setShowtime(showtimeData);
      } else if (eventData.showtimes) {
        const foundShowtime = eventData.showtimes.find(st => st.id === showId);
        setShowtime(foundShowtime);
      }
      
      // Generate seating layout
      const layout = generateSeatingLayout();
      setSeatingLayout(layout);
    } else {
      navigate('/events');
    }
  }, [showId, location, navigate, isAuthenticated]);

  const handleSeatClick = (seat) => {
    if (seat.isBooked) {
      alert('This seat is already booked. Please select another seat.');
      return;
    }
    
    if (selectedSeats.some(s => s.id === seat.id)) {
      // Remove seat if already selected
      setSelectedSeats(prev => prev.filter(s => s.id !== seat.id));
    } else {
      // Add seat (max 6 seats)
      if (selectedSeats.length < 6) {
        setSelectedSeats(prev => [...prev, seat]);
      } else {
        alert('Maximum 6 seats can be selected per booking');
      }
    }
  };

  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }

    const bookingDetails = {
      eventId: event.id,
      eventTitle: event.title,
      date: event.date,
      time: showtime?.time || event.time,
      venue: event.venue,
      showtime: showtime?.time,
      seats: selectedSeats.map(s => s.id),
      seatDetails: selectedSeats,
      ticketCount: selectedSeats.length,
      pricePerTicket: showtime?.price || event.price,
      convenienceFee: selectedSeats.length * 40,
      totalPrice: (selectedSeats.reduce((sum, seat) => sum + seat.price, 0)) + (selectedSeats.length * 40),
      bookingType: 'movie',
      userEmail: user?.email || '',
      userName: user?.name || '',
    };

    // Save to localStorage
    localStorage.setItem('currentBooking', JSON.stringify(bookingDetails));
    
    // Navigate to payment
    navigate('/payment', {
      state: {
        bookingDetails: bookingDetails,
        eventTitle: event.title,
        eventImage: event.image,
      }
    });
  };

  if (!event || !isAuthenticated) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5">Loading seat selection...</Typography>
      </Container>
    );
  }

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  const convenienceFee = selectedSeats.length * 40;
  const finalTotal = totalPrice + convenienceFee;

  const steps = ['Select Showtime', 'Choose Seats', 'Payment', 'Confirmation'];

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
      <Stepper activeStep={1} alternativeLabel sx={{ mb: 6 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={4}>
        {/* Left Column - Seat Selection */}
        <Grid item xs={12} md={8}>
          {/* Event Summary */}
          <Paper sx={{ p: 3, mb: 4, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {event.title}
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Date</Typography>
                <Typography variant="body1" fontWeight="medium">
                  {new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric'
                  })}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Time</Typography>
                <Typography variant="body1" fontWeight="medium">
                  {showtime?.time || event.time}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Venue</Typography>
                <Typography variant="body1" fontWeight="medium">{event.venue}</Typography>
              </Box>
            </Box>
          </Paper>

          {/* Screen */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ 
              width: '80%', 
              height: '4px', 
              backgroundColor: 'primary.main', 
              margin: '0 auto 10px',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '120%',
                height: '20px',
                backgroundColor: 'primary.light',
                borderRadius: '50%',
                opacity: 0.3,
              }
            }} />
            <Typography variant="h5" fontWeight="bold" color="primary">
              SCREEN
            </Typography>
            <Typography variant="caption" color="text.secondary">
              All eyes this way please
            </Typography>
          </Box>

          {/* Seat Legend */}
          <Paper sx={{ p: 2, mb: 4, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Seat Legend
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EventSeat sx={{ color: 'success.main', mr: 1, fontSize: 30 }} />
                <Box>
                  <Typography variant="body2" fontWeight="bold">Available</Typography>
                  <Typography variant="caption" color="text.secondary">Click to select</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EventSeat sx={{ color: 'primary.main', mr: 1, fontSize: 30 }} />
                <Box>
                  <Typography variant="body2" fontWeight="bold">Selected</Typography>
                  <Typography variant="caption" color="text.secondary">Your choice</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EventSeat sx={{ color: 'error.main', mr: 1, fontSize: 30 }} />
                <Box>
                  <Typography variant="body2" fontWeight="bold">Booked</Typography>
                  <Typography variant="caption" color="text.secondary">Not available</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EventSeat sx={{ color: 'warning.main', mr: 1, fontSize: 30 }} />
                <Box>
                  <Typography variant="body2" fontWeight="bold">Premium</Typography>
                  <Typography variant="caption" color="text.secondary">Extra legroom</Typography>
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Seating Layout */}
          <Paper sx={{ p: 3, mb: 4, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
              Select Your Seats
            </Typography>

            {/* Seats Grid */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              gap: 2,
              mb: 4
            }}>
              {seatingLayout.map((row) => (
                <Box key={row.row} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1" fontWeight="bold" sx={{ width: 30, textAlign: 'center' }}>
                    Row {row.row}
                  </Typography>
                  {row.seats.map((seat) => (
                    <IconButton
                      key={seat.id}
                      onClick={() => handleSeatClick(seat)}
                      disabled={seat.isBooked}
                      sx={{
                        p: 0.5,
                        minWidth: 40,
                        height: 40,
                        color: selectedSeats.some(s => s.id === seat.id) ? 'white' : seat.color,
                        backgroundColor: selectedSeats.some(s => s.id === seat.id) ? 'primary.main' : 
                                       seat.isBooked ? 'error.light' : 'transparent',
                        border: `2px solid ${seat.isBooked ? 'error.main' : seat.color}`,
                        borderRadius: '4px',
                        '&:hover': {
                          backgroundColor: seat.isBooked ? 'error.light' : 'primary.light',
                          transform: 'scale(1.1)',
                        },
                        '&.Mui-disabled': {
                          backgroundColor: 'error.light',
                          borderColor: 'error.main',
                          opacity: 0.7,
                        }
                      }}
                    >
                      <EventSeat fontSize="small" />
                    </IconButton>
                  ))}
                </Box>
              ))}
            </Box>

            {/* Row Information */}
            <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 4, flexWrap: 'wrap' }}>
              <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'warning.main', borderRadius: 2 }}>
                <Typography variant="subtitle2" color="warning.main" gutterBottom>
                  Premium (A1-A3, B1-B3)
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  ₹{(showtime?.price || 350) + 100}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'primary.main', borderRadius: 2 }}>
                <Typography variant="subtitle2" color="primary.main" gutterBottom>
                  Standard (A4-A7, B4-B7)
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  ₹{showtime?.price || 350}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'success.main', borderRadius: 2 }}>
                <Typography variant="subtitle2" color="success.main" gutterBottom>
                  Economy (A8-A10, B8-B10)
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  ₹{(showtime?.price || 350) - 50}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Selected Seats Summary */}
          {selectedSeats.length > 0 && (
            <Paper sx={{ p: 3, mb: 4, borderRadius: 2, boxShadow: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Your Selected Seats ({selectedSeats.length})
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                {selectedSeats.map(seat => (
                  <Chip
                    key={seat.id}
                    label={`${seat.id} - ₹${seat.price}`}
                    color="primary"
                    onDelete={() => handleSeatClick(seat)}
                    sx={{ fontSize: '0.9rem', fontWeight: 'bold' }}
                  />
                ))}
              </Box>
            </Paper>
          )}

          <Alert severity="info">
            <Typography variant="body2">
              <strong>Important:</strong>
              <br />
              • Click on seats to select/deselect
              <br />
              • Maximum 6 seats per booking
              <br />
              • Selected seats will be held for 10 minutes
              <br />
              • Please complete payment within 10 minutes to confirm booking
            </Typography>
          </Alert>
        </Grid>

        {/* Right Column - Booking Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ 
            p: 3, 
            position: 'sticky', 
            top: 20, 
            borderRadius: 2, 
            boxShadow: 3 
          }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: 'primary.main' }}>
              Booking Summary
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* Event Details */}
            <List>
              <ListItem sx={{ px: 0 }}>
                <ListItemText 
                  primary="Movie"
                  secondary={event.title}
                />
              </ListItem>
              
              <ListItem sx={{ px: 0 }}>
                <ListItemText 
                  primary="Date & Time"
                  secondary={`${new Date(event.date).toLocaleDateString()} • ${showtime?.time || event.time}`}
                />
              </ListItem>
              
              <ListItem sx={{ px: 0 }}>
                <ListItemText 
                  primary="Venue"
                  secondary={event.venue}
                />
              </ListItem>
              
              <ListItem sx={{ px: 0 }}>
                <ListItemText 
                  primary="Showtime"
                  secondary={showtime?.time || event.time}
                />
              </ListItem>
            </List>

            {/* Price Breakdown */}
            {selectedSeats.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Price Breakdown
                </Typography>
                
                <Box sx={{ maxHeight: 200, overflowY: 'auto', mb: 2 }}>
                  {selectedSeats.map(seat => (
                    <Box key={seat.id} sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      py: 1,
                      borderBottom: '1px solid',
                      borderColor: 'divider'
                    }}>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          Seat {seat.id}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {seat.type}
                        </Typography>
                      </Box>
                      <Typography variant="body1" fontWeight="bold">
                        ₹{seat.price}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  py: 1,
                  borderBottom: '1px solid',
                  borderColor: 'divider'
                }}>
                  <Typography variant="body2">Convenience Fee</Typography>
                  <Typography variant="body2">₹{convenienceFee}</Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  py: 1
                }}>
                  <Typography variant="h6">Total Amount</Typography>
                  <Typography variant="h4" color="primary" fontWeight="bold">
                    ₹{finalTotal}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* No Seats Selected Message */}
            {selectedSeats.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <EventSeat sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  No seats selected yet
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Select seats from the layout
                </Typography>
              </Box>
            )}

            {/* Action Button */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleProceedToPayment}
              disabled={selectedSeats.length === 0}
              sx={{ 
                mt: 3,
                py: 1.5,
                mb: 2,
                fontWeight: 'bold',
                fontSize: '1.1rem',
                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                },
                '&.Mui-disabled': {
                  background: 'grey.300',
                }
              }}
            >
              {selectedSeats.length === 0 ? 'Select Seats First' : `Proceed to Pay ₹${finalTotal}`}
            </Button>

            {/* User Info */}
            {user && (
              <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Booking for
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {user.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
            )}

            {/* Security Info */}
            <Alert severity="success" sx={{ mt: 2 }} icon={<CheckCircle />}>
              <Typography variant="caption">
                <strong>Secure Booking:</strong> Your seats are reserved for 10 minutes
              </Typography>
            </Alert>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SeatBookingPage;