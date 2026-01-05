import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Paper,
  Divider,
  Card,
  CardMedia,
  Chip,
  Alert,
} from '@mui/material';
import {
  ArrowBack,
  CalendarMonth,
  AccessTime,
  LocationOn,
  ConfirmationNumber,
  Star,
  Language,
  Theaters,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import mockEvents from '../data/mockEvents';

const CineplexPage = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);

  useEffect(() => {
    const foundEvent = mockEvents.find(e => e.id === parseInt(eventId));
    if (foundEvent) {
      setEvent(foundEvent);
      if (foundEvent.showtimes && foundEvent.showtimes.length > 0) {
        setSelectedShowtime(foundEvent.showtimes[0]);
      }
    }
  }, [eventId]);

  const handleBookNow = () => {
    if (!selectedShowtime) {
      alert('Please select a showtime');
      return;
    }

    // Save booking data
    const bookingData = {
      eventId: event.id,
      eventTitle: event.title,
      date: event.date,
      time: selectedShowtime.time,
      venue: event.venue,
      showtime: selectedShowtime.time,
      pricePerTicket: selectedShowtime.price,
      bookingType: 'movie',
    };
    
    localStorage.setItem('movieBooking', JSON.stringify(bookingData));
    
    // Navigate to seat selection
    navigate(`/booking/${selectedShowtime.id}`, {
      state: {
        event: event,
        showtime: selectedShowtime,
      }
    });
  };

  if (!event) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
          <Typography variant="h6">Event not found</Typography>
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/events')}
        >
          Back to Events
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/events')}
        sx={{ mb: 3 }}
        variant="outlined"
      >
        Back to Events
      </Button>

      <Grid container spacing={4}>
        {/* Left Column - Event Details */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 4, borderRadius: 2, boxShadow: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
                  <CardMedia
                    component="img"
                    height="300"
                    image={event.image}
                    alt={event.title}
                    sx={{ objectFit: 'cover' }}
                  />
                </Card>
              </Grid>
              
              <Grid item xs={12} md={8}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h4" fontWeight="bold" sx={{ flexGrow: 1 }}>
                    {event.title}
                  </Typography>
                  <Chip label={event.category} color="primary" sx={{ fontWeight: 'bold' }} />
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Star sx={{ color: 'warning.main', mr: 1 }} />
                  <Typography variant="body1" fontWeight="medium" sx={{ mr: 2 }}>
                    {event.rating}/5
                  </Typography>
                  <Language sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {event.language}
                  </Typography>
                </Box>
                
                <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                  {event.description}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CalendarMonth sx={{ mr: 2, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Date
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {new Date(event.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AccessTime sx={{ mr: 2, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Time
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {event.time}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <LocationOn sx={{ mr: 2, color: 'primary.main', mt: 0.5 }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Venue
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {event.venue}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>

          {/* Showtimes */}
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
              Select Showtime
            </Typography>
            
            <Grid container spacing={2}>
              {event.showtimes && event.showtimes.length > 0 ? (
                event.showtimes.map((showtime) => (
                  <Grid item xs={6} sm={4} md={3} key={showtime.id}>
                    <Card
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        border: selectedShowtime?.id === showtime.id ? 2 : 1,
                        borderColor: selectedShowtime?.id === showtime.id ? 'primary.main' : 'divider',
                        backgroundColor: selectedShowtime?.id === showtime.id ? 'primary.50' : 'background.paper',
                        borderRadius: 2,
                        transition: 'all 0.3s',
                        '&:hover': {
                          borderColor: 'primary.main',
                          transform: 'translateY(-2px)',
                          boxShadow: 4,
                        },
                      }}
                      onClick={() => setSelectedShowtime(showtime)}
                    >
                      <Typography variant="h6" fontWeight="bold" align="center" color="primary">
                        {showtime.time}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="center">
                        {showtime.seats} seats available
                      </Typography>
                      <Typography variant="h6" color="primary" fontWeight="bold" align="center" sx={{ mt: 1 }}>
                        ₹{showtime.price}
                      </Typography>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Alert severity="info">No showtimes available</Alert>
                </Grid>
              )}
            </Grid>
          </Paper>
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

            {/* Selected Showtime */}
            {selectedShowtime && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Selected Showtime
                </Typography>
                <Typography variant="h5" color="primary" fontWeight="bold">
                  {selectedShowtime.time}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                </Typography>
              </Box>
            )}

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Movie Details
              </Typography>
              <Typography variant="body1" fontWeight="medium">{event.title}</Typography>
              <Typography variant="body2" color="text.secondary">{event.duration}</Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Venue
              </Typography>
              <Typography variant="body1" fontWeight="medium">{event.venue}</Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Ticket Price
              </Typography>
              <Typography variant="h3" color="primary" fontWeight="bold">
                ₹{selectedShowtime?.price || event.price}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Per ticket + convenience fees
              </Typography>
            </Box>

            {/* Book Button */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleBookNow}
              disabled={!selectedShowtime}
              sx={{ 
                py: 1.5,
                mb: 2,
                fontWeight: 'bold',
                fontSize: '1.1rem',
                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                }
              }}
            >
              Select Seats
            </Button>

            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                • Select seats in the next step
                <br />
                • Convenience fee: ₹40 per ticket
                <br />
                • Tickets are non-refundable
                <br />
                • Please arrive 30 minutes before showtime
              </Typography>
            </Alert>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CineplexPage;