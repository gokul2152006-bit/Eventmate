import React, { useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  Button,
  Paper,
  Tabs,
  Tab,
  Alert,
  IconButton,
  Badge,
} from '@mui/material';
import {
  ConfirmationNumber,
  Event,
  CalendarToday,
  LocationOn,
  AccessTime,
  Download,
  Cancel,
  QrCode,
  MoreVert,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { loadMockBookings, cancelBooking } from '../store/slices/bookingSlice';

const MyBookingsPage = () => {
  const dispatch = useDispatch();
  const { bookings, upcomingBookings, pastBookings } = useSelector((state) => state.bookings);
  const [activeTab, setActiveTab] = React.useState(0);

  // Load bookings on component mount
  useEffect(() => {
    // Load mock bookings for demo
    dispatch(loadMockBookings());
  }, [dispatch]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'pending':
        return 'Pending';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const handleCancelBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      dispatch(cancelBooking(bookingId));
    }
  };

  const handleDownloadTicket = (booking) => {
    // Create ticket content
    const ticketContent = `
===================================
EVENT MATE - E-TICKET
===================================
Booking ID: ${booking.id}
Event: ${booking.eventTitle}
Date: ${formatDate(booking.date)}
Time: ${formatTime(booking.time)}
Venue: ${booking.venue}
${booking.section ? `Section: ${booking.section}` : `Showtime: ${booking.showtime}`}
${booking.seats ? `Seats: ${booking.seats.join(', ')}` : `Tickets: ${booking.ticketCount}`}
Total: ₹${booking.totalPrice}
Booking Type: ${booking.bookingType}
Booking Date: ${formatDate(booking.bookingDate)}
Status: ${booking.bookingStatus}
===================================
This is your e-ticket. Please show at entry.
Keep this ticket safe. Do not share with others.
===================================
    `;
    
    // Create and download file
    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket-${booking.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const filteredBookings = () => {
    switch (activeTab) {
      case 0: // All
        return bookings;
      case 1: // Upcoming
        return upcomingBookings;
      case 2: // Past
        return pastBookings;
      case 3: // Confirmed
        return bookings.filter(b => b.bookingStatus === 'confirmed');
      case 4: // Cancelled
        return bookings.filter(b => b.bookingStatus === 'cancelled');
      default:
        return bookings;
    }
  };

  const tabLabels = [
    `All (${bookings.length})`,
    `Upcoming (${upcomingBookings.length})`,
    `Past (${pastBookings.length})`,
    `Confirmed (${bookings.filter(b => b.bookingStatus === 'confirmed').length})`,
    `Cancelled (${bookings.filter(b => b.bookingStatus === 'cancelled').length})`,
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          My Bookings
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          View and manage all your event bookings in one place
        </Typography>
      </Box>

      {/* Stats Summary */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" fontWeight="bold" color="primary">
              {bookings.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Bookings
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" fontWeight="bold" color="success.main">
              {upcomingBookings.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Upcoming
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" fontWeight="bold" color="warning.main">
              {bookings.filter(b => b.bookingStatus === 'confirmed').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Confirmed
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" fontWeight="bold" color="error.main">
              {bookings.filter(b => b.bookingStatus === 'cancelled').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Cancelled
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabLabels.map((label, index) => (
            <Tab key={index} label={label} />
          ))}
        </Tabs>
      </Paper>

      {/* Bookings List */}
      {filteredBookings().length === 0 ? (
        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography>
            No bookings found for the selected category.
          </Typography>
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredBookings().map((booking) => (
            <Grid item xs={12} key={booking.id}>
              <Card>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    {/* Left Section */}
                    <Grid item xs={12} md={8}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <ConfirmationNumber color="primary" sx={{ mr: 1 }} />
                        <Typography variant="subtitle2" color="text.secondary">
                          Booking ID: {booking.id}
                        </Typography>
                        <Chip
                          label={getStatusText(booking.bookingStatus)}
                          color={getStatusColor(booking.bookingStatus)}
                          size="small"
                          sx={{ ml: 2 }}
                        />
                        <Chip
                          label={booking.bookingType === 'movie' ? 'Movie' : 'Event'}
                          variant="outlined"
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      </Box>
                      
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {booking.eventTitle}
                      </Typography>
                      
                      {/* Event Details */}
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        <Chip
                          icon={<CalendarToday />}
                          label={formatDate(booking.date)}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          icon={<AccessTime />}
                          label={formatTime(booking.time)}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          icon={<LocationOn />}
                          label={booking.venue}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                      
                      {/* Booking Details */}
                      <Grid container spacing={2} sx={{ mb: 1 }}>
                        <Grid item xs={6} sm={4}>
                          <Typography variant="caption" color="text.secondary">
                            {booking.bookingType === 'movie' ? 'Showtime' : 'Section'}
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {booking.bookingType === 'movie' ? booking.showtime : booking.section}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={4}>
                          <Typography variant="caption" color="text.secondary">
                            Tickets
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {booking.ticketCount} {booking.ticketCount === 1 ? 'ticket' : 'tickets'}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={4}>
                          <Typography variant="caption" color="text.secondary">
                            Booking Date
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {formatDate(booking.bookingDate)}
                          </Typography>
                        </Grid>
                      </Grid>
                      
                      {/* Seats for movies */}
                      {booking.seats && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                            Seats:
                          </Typography>
                          <Typography variant="body2">
                            {booking.seats.join(', ')}
                          </Typography>
                        </Box>
                      )}
                    </Grid>
                    
                    {/* Right Section */}
                    <Grid item xs={12} md={4}>
                      <Box sx={{ textAlign: { md: 'right' } }}>
                        {/* Price */}
                        <Typography variant="h5" fontWeight="bold" color="primary" sx={{ mb: 1 }}>
                          ₹{booking.totalPrice}
                        </Typography>
                        
                        <Typography variant="caption" color="text.secondary">
                          {booking.ticketCount} × ₹{booking.pricePerTicket} + fees
                        </Typography>
                        
                        {/* Action Buttons */}
                        <Box sx={{ 
                          display: 'flex', 
                          gap: 1, 
                          mt: 2,
                          justifyContent: { md: 'flex-end' },
                          flexWrap: 'wrap'
                        }}>
                          {booking.bookingStatus === 'confirmed' && (
                            <>
                              <Button
                                variant="contained"
                                size="small"
                                startIcon={<Download />}
                                onClick={() => handleDownloadTicket(booking)}
                              >
                                Ticket
                              </Button>
                              
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<QrCode />}
                                onClick={() => alert(`QR Code for ${booking.id}`)}
                              >
                                QR Code
                              </Button>
                              
                              <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                startIcon={<Cancel />}
                                onClick={() => handleCancelBooking(booking.id)}
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                          
                          {booking.bookingStatus === 'cancelled' && (
                            <Alert severity="error" sx={{ mt: 1 }}>
                              <Typography variant="caption">
                                Cancelled • Refund initiated
                              </Typography>
                            </Alert>
                          )}
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Help Section */}
      <Alert severity="info" sx={{ mt: 4 }}>
        <Typography variant="body2">
          <strong>Need help with a booking?</strong>
          <br />
          • Contact our support team at support@eventmate.com
          <br />
          • Call us at +91 98765 43210
          <br />
          • Cancellation window: Up to 24 hours before the event
          <br />
          • Refunds processed within 5-7 business days
        </Typography>
      </Alert>
      
      {/* Call to Action */}
      <Box sx={{ textAlign: 'center', mt: 6, mb: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Can't find your booking?
        </Typography>
        <Button
          variant="contained"
          onClick={() => dispatch(loadMockBookings())}
          sx={{ mr: 2 }}
        >
          Reload Bookings
        </Button>
        <Button
          variant="outlined"
          onClick={() => window.print()}
        >
          Print Booking History
        </Button>
      </Box>
    </Container>
  );
};

export default MyBookingsPage;