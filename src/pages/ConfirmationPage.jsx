import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Divider,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  CheckCircle,
  CalendarMonth,
  AccessTime,
  LocationOn,
  ConfirmationNumber,
  QrCode,
  Download,
  Share,
  Email,
  Receipt,
  Print,
  ArrowBack,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const ConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [booking, setBooking] = useState(null);
  const [ticketId, setTicketId] = useState('');

  useEffect(() => {
    const bookingDetails = location.state?.booking;
    
    if (bookingDetails) {
      setBooking(bookingDetails);
      // Generate ticket ID
      const generatedId = 'TICKET-' + Date.now().toString().slice(-8);
      setTicketId(generatedId);
    } else {
      navigate('/events');
    }
  }, [location, navigate]);

  const handleDownloadTicket = () => {
    // Create ticket content
    const ticketContent = `
===================================
EVENT MATE - E-TICKET
===================================
Ticket ID: ${ticketId}
Event: ${booking.eventTitle}
Date: ${new Date(booking.date).toLocaleDateString()}
Time: ${booking.time}
Venue: ${booking.venue}
${booking.seats ? `Seats: ${booking.seats.join(', ')}` : `Section: ${booking.section}`}
Tickets: ${booking.ticketCount}
Total: ₹${booking.totalPrice}
Booking ID: ${booking.id}
Transaction ID: ${booking.transactionId}
Booking Type: ${booking.bookingType}
Booking Date: ${new Date(booking.bookingDate).toLocaleDateString()}
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
    a.download = `ticket-${ticketId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handlePrintBill = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>EventMate - Booking Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .success-icon { color: #4caf50; font-size: 48px; }
            .details { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #f2f2f2; }
            .total { font-weight: bold; font-size: 1.2em; }
            .footer { margin-top: 30px; text-align: center; font-size: 0.9em; color: #666; }
            .qr-code { text-align: center; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="success-icon">✓</div>
            <h2>BOOKING CONFIRMED!</h2>
            <p>Your tickets have been successfully booked</p>
            <p>Ticket ID: ${ticketId}</p>
          </div>
          
          <div class="details">
            <h3>Booking Details</h3>
            <p><strong>Booking ID:</strong> ${booking.id}</p>
            <p><strong>Event:</strong> ${booking.eventTitle}</p>
            <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${booking.time}</p>
            <p><strong>Venue:</strong> ${booking.venue}</p>
            ${booking.seats ? `<p><strong>Seats:</strong> ${booking.seats.join(', ')}</p>` : ''}
            ${booking.section ? `<p><strong>Section:</strong> ${booking.section}</p>` : ''}
            <p><strong>Tickets:</strong> ${booking.ticketCount}</p>
          </div>
          
          <div class="details">
            <h3>Payment Details</h3>
            <p><strong>Transaction ID:</strong> ${booking.transactionId}</p>
            <p><strong>Payment Method:</strong> ${booking.paymentMethod}</p>
            <p><strong>Status:</strong> PAID</p>
            <p><strong>Booking Date:</strong> ${new Date(booking.bookingDate).toLocaleDateString()}</p>
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
                <td>${booking.seats ? 'Movie Tickets' : 'Event Tickets'}</td>
                <td>${booking.ticketCount}</td>
                <td>₹${booking.pricePerTicket}</td>
                <td>₹${booking.pricePerTicket * booking.ticketCount}</td>
              </tr>
              <tr>
                <td>Convenience Fee</td>
                <td>${booking.ticketCount}</td>
                <td>₹40</td>
                <td>₹${booking.convenienceFee}</td>
              </tr>
              <tr class="total">
                <td colspan="3" style="text-align: right;">Total Amount:</td>
                <td>₹${booking.totalPrice}</td>
              </tr>
            </tbody>
          </table>
          
          <div class="qr-code">
            <p><strong>SCAN AT ENTRY</strong></p>
            <div style="width: 150px; height: 150px; border: 1px solid #000; margin: 0 auto;">
              <!-- QR Code Placeholder -->
              <div style="text-align: center; line-height: 150px;">QR CODE</div>
            </div>
          </div>
          
          <div class="footer">
            <p>===================================</p>
            <p>Thank you for booking with EventMate!</p>
            <p>Please arrive 30 minutes before the event.</p>
            <p>Carry a valid ID proof and this confirmation.</p>
            <p>For support: support@eventmate.com | +91 98765 43210</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `My Ticket for ${booking.eventTitle}`,
        text: `I've booked tickets for ${booking.eventTitle} on ${booking.date} at ${booking.venue}`,
        url: window.location.href,
      });
    } else {
      alert('Booking details copied to clipboard!');
      navigator.clipboard.writeText(`Booking ID: ${booking.id}\nEvent: ${booking.eventTitle}\nDate: ${booking.date}\nTime: ${booking.time}\nVenue: ${booking.venue}`);
    }
  };

  if (!booking) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5">Loading confirmation...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Success Header */}
      <Paper sx={{ 
        p: 4, 
        mb: 4, 
        textAlign: 'center', 
        backgroundColor: 'success.light',
        borderRadius: 2,
        boxShadow: 3
      }}>
        <CheckCircle sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Booking Confirmed!
        </Typography>
        <Typography variant="h6" gutterBottom>
          Your tickets have been successfully booked
        </Typography>
        <Typography variant="body1" color="text.secondary">
          A confirmation email has been sent to your registered email address
        </Typography>
      </Paper>

      <Grid container spacing={4}>
        {/* Left Column - Booking Details */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 4, borderRadius: 2, boxShadow: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" fontWeight="bold">
                Booking Details
              </Typography>
              <Chip 
                label={booking.bookingStatus.toUpperCase()} 
                color="success" 
                sx={{ fontWeight: 'bold' }}
              />
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, mb: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Booking ID
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    {booking.id}
                  </Typography>
                </Card>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Ticket ID
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="secondary">
                    {ticketId}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Event
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {booking.eventTitle}
                  </Typography>
                </Box>
                
                <List>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <CalendarMonth color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Date"
                      secondary={new Date(booking.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    />
                  </ListItem>
                  
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <AccessTime color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Time"
                      secondary={booking.time}
                    />
                  </ListItem>
                  
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <LocationOn color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Venue"
                      secondary={booking.venue}
                    />
                  </ListItem>
                </List>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, mb: 3, borderRadius: 2, boxShadow: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Ticket Details
                  </Typography>
                  
                  {booking.seats ? (
                    <>
                      <Typography variant="body1" fontWeight="medium" gutterBottom>
                        Seats Selected
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        {booking.seats.map(seat => (
                          <Chip key={seat} label={seat} color="primary" sx={{ fontWeight: 'bold' }} />
                        ))}
                      </Box>
                    </>
                  ) : (
                    <Typography variant="body1" fontWeight="medium" gutterBottom>
                      Section: {booking.section}
                    </Typography>
                  )}
                  
                  <Typography variant="body2" color="text.secondary">
                    Tickets: {booking.ticketCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Booking Type: {booking.bookingType === 'movie' ? 'Movie' : 'Event'}
                  </Typography>
                </Card>
                
                <Card sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2, boxShadow: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    QR Code
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    height: 150,
                    bgcolor: 'white',
                    borderRadius: 2,
                    border: '2px dashed',
                    borderColor: 'primary.main',
                  }}>
                    <QrCode sx={{ fontSize: 100, color: 'primary.main' }} />
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
                    Scan this QR code at entry
                  </Typography>
                </Card>
              </Grid>
            </Grid>

            {/* Bill Summary */}
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Bill Summary
            </Typography>
            
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Unit Price</TableCell>
                    <TableCell align="right">Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      {booking.seats ? 'Movie Tickets' : 'Event Tickets'}
                    </TableCell>
                    <TableCell align="right">{booking.ticketCount}</TableCell>
                    <TableCell align="right">₹{booking.pricePerTicket}</TableCell>
                    <TableCell align="right">₹{booking.pricePerTicket * booking.ticketCount}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Convenience Fee</TableCell>
                    <TableCell align="right">{booking.ticketCount}</TableCell>
                    <TableCell align="right">₹40</TableCell>
                    <TableCell align="right">₹{booking.convenienceFee}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} align="right">
                      <Typography variant="subtitle1" fontWeight="bold">
                        Total Amount:
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h6" color="primary" fontWeight="bold">
                        ₹{booking.totalPrice}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            {/* Payment Info */}
            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2">
                <strong>Payment Details:</strong>
                <br />
                • Payment Method: {booking.paymentMethod}
                <br />
                • Transaction ID: {booking.transactionId}
                <br />
                • Status: {booking.paymentStatus}
                <br />
                • Booking Date: {new Date(booking.bookingDate).toLocaleDateString()}
              </Typography>
            </Alert>
          </Paper>
        </Grid>

        {/* Right Column - Actions */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ 
            p: 3, 
            position: 'sticky', 
            top: 20, 
            borderRadius: 2, 
            boxShadow: 3 
          }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Next Steps
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* Action Buttons */}
            <Box sx={{ mb: 4 }}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<Download />}
                onClick={handleDownloadTicket}
                sx={{ mb: 2, py: 1.5, borderRadius: 2 }}
              >
                Download Ticket
              </Button>
              
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Receipt />}
                onClick={handlePrintBill}
                sx={{ mb: 2, py: 1.5, borderRadius: 2 }}
              >
                Print Bill
              </Button>
              
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Share />}
                onClick={handleShare}
                sx={{ mb: 2, py: 1.5, borderRadius: 2 }}
              >
                Share Booking
              </Button>
              
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Email />}
                onClick={() => alert('Email receipt has been sent to your registered email!')}
                sx={{ py: 1.5, borderRadius: 2 }}
              >
                Email Receipt
              </Button>
            </Box>

            {/* Important Information */}
            <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
              <Typography variant="body2">
                <strong>Important Instructions:</strong>
                <br />
                • Please arrive 30 minutes before the event
                <br />
                • Carry a valid ID proof (Aadhar, Passport, etc.)
                <br />
                • Show this ticket or QR code at entry
                <br />
                • Tickets are non-transferable and non-refundable
                <br />
                • Parking available at venue (subject to availability)
              </Typography>
            </Alert>

            {/* Support Info */}
            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Need Help?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                📧 support@eventmate.com
                <br />
                📞 +91 98765 43210
                <br />
                ⏰ Mon-Sun: 9 AM - 9 PM
              </Typography>
            </Box>

            {/* Navigation Buttons */}
            <Box sx={{ mt: 4 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => navigate('/bookings')}
                sx={{ mb: 2, borderRadius: 2 }}
              >
                View My Bookings
              </Button>
              
              <Button
                fullWidth
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={() => navigate('/events')}
                sx={{ borderRadius: 2 }}
              >
                Book More Events
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ConfirmationPage;