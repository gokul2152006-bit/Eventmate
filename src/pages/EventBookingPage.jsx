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
  Card,
  CardContent,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  ArrowBack,
  CalendarMonth,
  AccessTime,
  LocationOn,
  Groups,
  ConfirmationNumber,
  Add,
  Remove,
  CheckCircle,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import mockEvents from '../data/mockEvents';

const EventBookingPage = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const [ticketCount, setTicketCount] = useState(1);
  const [selectedSection, setSelectedSection] = useState('');
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundEvent = mockEvents.find(e => e.id === parseInt(eventId) && e.type !== 'cineplex');
    setEvent(foundEvent);
    setLoading(false);
    
    if (foundEvent && foundEvent.sections && foundEvent.sections.length > 0) {
      setSelectedSection(foundEvent.sections[0].name);
    }
  }, [eventId]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', { state: { from: `/event-booking/${eventId}` } });
    }
  }, [isAuthenticated, loading, navigate, eventId]);

  const handleTicketChange = (change) => {
    const newCount = Math.max(1, Math.min(10, ticketCount + change));
    setTicketCount(newCount);
  };

  const getSelectedSectionData = () => {
    if (!event || !event.sections) return { price: event?.price || 0, seats: 0 };
    
    return event.sections.find(s => s.name === selectedSection) || 
           event.sections[0] || 
           { price: event.price, seats: 100 };
  };

  const handleProceedToPayment = () => {
    if (!selectedSection) {
      alert('Please select a section');
      return;
    }

    const sectionData = getSelectedSectionData();
    const totalPrice = sectionData.price * ticketCount;
    const convenienceFee = ticketCount * 40;
    const finalTotal = totalPrice + convenienceFee;

    const bookingDetails = {
      eventId: event.id,
      eventTitle: event.title,
      date: event.date,
      time: event.time,
      venue: event.venue,
      section: selectedSection,
      ticketCount: ticketCount,
      pricePerTicket: sectionData.price,
      convenienceFee: convenienceFee,
      totalPrice: finalTotal,
      bookingType: 'event',
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

  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5">Loading...</Typography>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
          <Typography variant="h6">Event not found</Typography>
          <Typography>This event might not be available for booking.</Typography>
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

  const selectedSectionData = getSelectedSectionData();
  const totalPrice = selectedSectionData.price * ticketCount;
  const convenienceFee = ticketCount * 40;
  const finalTotal = totalPrice + convenienceFee;

  const steps = ['Event Details', 'Select Tickets', 'Payment', 'Confirmation'];

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

      {/* Stepper */}
      <Stepper activeStep={1} alternativeLabel sx={{ mb: 6 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={4}>
        {/* Left Column - Event Details & Ticket Selection */}
        <Grid item xs={12} md={8}>
          {/* Event Summary */}
          <Paper sx={{ p: 3, mb: 4, borderRadius: 2, boxShadow: 3 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%', borderRadius: 2, overflow: 'hidden' }}>
                  <Box
                    component="img"
                    src={event.image}
                    alt={event.title}
                    sx={{
                      width: '100%',
                      height: 200,
                      objectFit: 'cover',
                    }}
                  />
                </Card>
              </Grid>

              <Grid item xs={12} md={8}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {event.title}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Chip 
                    label={event.category} 
                    color="secondary" 
                    sx={{ mr: 2, fontWeight: 'bold' }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ConfirmationNumber sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)} Event
                    </Typography>
                  </Box>
                </Box>
                
                <Typography variant="body1" color="text.secondary" paragraph>
                  {event.description}
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
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
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
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

          {/* Ticket Quantity Selection */}
          <Paper sx={{ p: 3, mb: 4, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Select Number of Tickets
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              maxWidth: 400,
              mb: 4,
              p: 3,
              border: '2px solid',
              borderColor: 'primary.main',
              borderRadius: 2,
              backgroundColor: 'primary.50',
            }}>
              <IconButton 
                onClick={() => handleTicketChange(-1)}
                disabled={ticketCount <= 1}
                size="large"
                sx={{ 
                  backgroundColor: 'white',
                  '&:hover': { backgroundColor: 'grey.100' }
                }}
              >
                <Remove />
              </IconButton>
              
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" fontWeight="bold" color="primary">
                  {ticketCount}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {ticketCount === 1 ? 'Ticket' : 'Tickets'}
                </Typography>
              </Box>
              
              <IconButton 
                onClick={() => handleTicketChange(1)}
                disabled={ticketCount >= 10}
                size="large"
                sx={{ 
                  backgroundColor: 'white',
                  '&:hover': { backgroundColor: 'grey.100' }
                }}
              >
                <Add />
              </IconButton>
            </Box>
            
            <Typography variant="body2" color="text.secondary">
              Maximum 10 tickets per booking
            </Typography>
          </Paper>

          {/* Section Selection */}
          {event.sections && event.sections.length > 0 && (
            <Paper sx={{ p: 3, mb: 4, borderRadius: 2, boxShadow: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Select Section
              </Typography>
              
              <Grid container spacing={2}>
                {event.sections.map((section) => (
                  <Grid item xs={12} sm={6} key={section.id}>
                    <Card
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        border: selectedSection === section.name ? 3 : 1,
                        borderColor: selectedSection === section.name ? 'secondary.main' : 'divider',
                        backgroundColor: selectedSection === section.name ? 'secondary.50' : 'background.paper',
                        borderRadius: 2,
                        transition: 'all 0.3s',
                        '&:hover': {
                          borderColor: 'secondary.main',
                          transform: 'translateY(-4px)',
                          boxShadow: 6,
                        },
                      }}
                      onClick={() => setSelectedSection(section.name)}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6" fontWeight="bold">
                          {section.name}
                        </Typography>
                        {selectedSection === section.name && (
                          <CheckCircle color="secondary" />
                        )}
                      </Box>
                      
                      <Typography variant="h4" color="secondary" fontWeight="bold">
                        ₹{section.price}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {section.seats} seats available
                      </Typography>
                      
                      <Box sx={{ 
                        mt: 2, 
                        p: 1, 
                        backgroundColor: 'grey.50', 
                        borderRadius: 1 
                      }}>
                        <Typography variant="caption" color="text.secondary">
                          Includes all venue facilities
                        </Typography>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          )}

          {/* Important Information */}
          <Alert severity="info">
            <Typography variant="body2">
              <strong>Important Information:</strong>
              <br />
              • Tickets are non-transferable and non-refundable
              <br />
              • Please carry a valid ID proof (Aadhar, Passport, etc.)
              <br />
              • Children above 3 years require a ticket
              <br />
              • Arrive at least 30 minutes before the event
              <br />
              • Follow all venue rules and regulations
              <br />
              • Parking available on premises (subject to availability)
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
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: 'secondary.main' }}>
              Booking Summary
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* Price Breakdown */}
            <List sx={{ mb: 3 }}>
              <ListItem sx={{ px: 0 }}>
                <ListItemText 
                  primary={
                    <Typography variant="body1" fontWeight="medium">
                      {selectedSection} × {ticketCount} {ticketCount > 1 ? 'tickets' : 'ticket'}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      Section Price
                    </Typography>
                  }
                />
                <Typography variant="body1" fontWeight="bold">
                  ₹{totalPrice}
                </Typography>
              </ListItem>
              
              <ListItem sx={{ px: 0 }}>
                <ListItemText 
                  primary="Convenience Fee"
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      Per ticket: ₹40
                    </Typography>
                  }
                />
                <Typography variant="body1" fontWeight="medium">
                  ₹{convenienceFee}
                </Typography>
              </ListItem>
              
              <Divider sx={{ my: 1 }} />
              
              <ListItem sx={{ px: 0 }}>
                <ListItemText 
                  primary={
                    <Typography variant="h6" fontWeight="bold">
                      Total Amount
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      All taxes included
                    </Typography>
                  }
                />
                <Typography variant="h4" color="secondary" fontWeight="bold">
                  ₹{finalTotal}
                </Typography>
              </ListItem>
            </List>

            {/* Event Details */}
            <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Event Details
              </Typography>
              <Typography variant="body2" fontWeight="medium" gutterBottom>
                {event.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })} • {event.time}
              </Typography>
              <br />
              <Typography variant="caption" color="text.secondary">
                {event.venue}
              </Typography>
            </Box>

            {/* User Info */}
            {user && (
              <Box sx={{ mb: 3, p: 2, bgcolor: 'primary.50', borderRadius: 2 }}>
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

            {/* Action Button */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleProceedToPayment}
              disabled={!selectedSection || ticketCount === 0}
              sx={{ 
                mt: 3,
                py: 1.5,
                mb: 2,
                fontWeight: 'bold',
                fontSize: '1.1rem',
                background: 'linear-gradient(45deg, #f50057 30%, #ff4081 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #c51162 30%, #f50057 90%)',
                },
                '&.Mui-disabled': {
                  background: 'grey.300',
                }
              }}
            >
              {!selectedSection ? 'Select Section' : `Proceed to Pay ₹${finalTotal}`}
            </Button>

            {/* Security Info */}
            <Alert severity="success" sx={{ mt: 2 }} icon={<CheckCircle />}>
              <Typography variant="caption">
                <strong>Secure Booking:</strong> Verified tickets • Instant confirmation • Best price guarantee
              </Typography>
            </Alert>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EventBookingPage;