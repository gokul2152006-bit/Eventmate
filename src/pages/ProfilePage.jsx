import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Avatar,
  Box,
  Grid,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Card,
  CardContent,
  Chip,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  LocationOn,
  Edit,
  Save,
  Cancel,
  ConfirmationNumber,
  Event,
  CalendarToday,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
  });

  // Mock booking history data
  const mockBookings = [
    {
      id: '1',
      eventName: 'Avengers: Endgame',
      date: '2024-12-15',
      time: '19:00',
      venue: 'PVR Cinemas',
      seats: ['A1', 'A2'],
      total: 1200,
      status: 'confirmed',
    },
    {
      id: '2',
      eventName: 'Coldplay Concert',
      date: '2024-12-20',
      time: '20:00',
      venue: 'Stadium Arena',
      seats: ['VIP-12'],
      total: 3500,
      status: 'confirmed',
    },
    {
      id: '3',
      eventName: 'Tech Conference 2024',
      date: '2024-12-10',
      time: '09:00',
      venue: 'Convention Center',
      seats: ['GA-45'],
      total: 800,
      status: 'pending',
    },
  ];

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    // Here you would typically make an API call to update the profile
    setIsEditing(false);
    // Update user in Redux if needed
  };

  const handleCancelClick = () => {
    setProfileData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      address: '',
    });
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        My Profile
      </Typography>

      <Grid container spacing={4}>
        {/* Left Column - Profile Info */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  margin: '0 auto 16px',
                  bgcolor: 'primary.main',
                  fontSize: '3rem',
                }}
              >
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
              {!isEditing ? (
                <>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {user?.name || 'User'}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    {user?.email}
                  </Typography>
                  <IconButton
                    color="primary"
                    onClick={handleEditClick}
                    sx={{ mt: 1 }}
                  >
                    <Edit />
                  </IconButton>
                </>
              ) : (
                <Box sx={{ mt: 2 }}>
                  <IconButton color="primary" onClick={handleSaveClick}>
                    <Save />
                  </IconButton>
                  <IconButton color="error" onClick={handleCancelClick}>
                    <Cancel />
                  </IconButton>
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Account Details
              </Typography>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.light' }}>
                      <Person />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Member Since"
                    secondary="December 2024"
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'secondary.light' }}>
                      <ConfirmationNumber />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Total Bookings"
                    secondary={mockBookings.length}
                  />
                </ListItem>
              </List>
            </Box>

            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2">
                Your profile information is secure and encrypted.
              </Typography>
            </Alert>
          </Paper>
        </Grid>

        {/* Right Column - Tabs Content */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ width: '100%' }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="Personal Info" />
              <Tab label="Booking History" />
              <Tab label="Preferences" />
            </Tabs>

            {/* Tab 1: Personal Info */}
            {activeTab === 0 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Personal Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: <Person sx={{ mr: 1, color: 'action.active' }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: <Email sx={{ mr: 1, color: 'action.active' }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="+1 (555) 123-4567"
                      InputProps={{
                        startAdornment: <Phone sx={{ mr: 1, color: 'action.active' }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Address"
                      name="address"
                      value={profileData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="123 Main St, City, Country"
                      InputProps={{
                        startAdornment: <LocationOn sx={{ mr: 1, color: 'action.active' }} />,
                      }}
                    />
                  </Grid>
                </Grid>

                {isEditing && (
                  <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      onClick={handleSaveClick}
                      startIcon={<Save />}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleCancelClick}
                      startIcon={<Cancel />}
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
              </Box>
            )}

            {/* Tab 2: Booking History */}
            {activeTab === 1 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Booking History
                </Typography>
                {mockBookings.map((booking) => (
                  <Card key={booking.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12} md={8}>
                          <Typography variant="h6" fontWeight="bold">
                            {booking.eventName}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, flexWrap: 'wrap', gap: 1 }}>
                            <Chip
                              icon={<Event />}
                              label={formatDate(booking.date)}
                              size="small"
                              variant="outlined"
                            />
                            <Chip
                              icon={<CalendarToday />}
                              label={booking.time}
                              size="small"
                              variant="outlined"
                            />
                            <Chip
                              label={booking.venue}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Seats: {booking.seats.join(', ')}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
                          <Typography variant="h5" fontWeight="bold" color="primary">
                            ₹{booking.total}
                          </Typography>
                          <Chip
                            label={booking.status.toUpperCase()}
                            color={getStatusColor(booking.status)}
                            size="small"
                            sx={{ mt: 1 }}
                          />
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{ mt: 1, display: 'block', ml: 'auto' }}
                          >
                            View Details
                          </Button>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}

            {/* Tab 3: Preferences */}
            {activeTab === 2 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Preferences
                </Typography>
                <Alert severity="info" sx={{ mb: 3 }}>
                  <Typography variant="body2">
                    Manage your notification preferences and account settings here.
                    This feature is coming soon!
                  </Typography>
                </Alert>
                <Typography variant="body1" color="text.secondary">
                  • Email notifications for new events
                  <br />
                  • SMS alerts for booking confirmations
                  <br />
                  • Personalized event recommendations
                  <br />
                  • Newsletter subscription
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage;