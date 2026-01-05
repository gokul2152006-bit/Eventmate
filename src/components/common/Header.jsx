import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MovieIcon from '@mui/icons-material/Movie'; // Make sure you have @mui/icons-material installed

const Header = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="sticky" elevation={2} sx={{ bgcolor: 'primary.main' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* LOGO AREA */}
          <MovieIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 4,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
              letterSpacing: '.1rem',
            }}
          >
            EventMate
          </Typography>

          {/* NAVIGATION BUTTONS */}
          <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
            <Button
              onClick={() => navigate('/')}
              sx={{ color: 'white', display: 'block' }}
            >
              Home
            </Button>
            <Button
              onClick={() => navigate('/events')}
              sx={{ color: 'white', display: 'block' }}
            >
              Events
            </Button>
            <Button
              onClick={() => navigate('/bookings')}
              sx={{ color: 'white', display: 'block' }}
            >
              My Bookings
            </Button>
            
            {/* 🔴 NEW ADMIN BUTTON ADDED HERE 🔴 */}
            <Button
              onClick={() => navigate('/admin')}
              sx={{ 
                color: '#ff4081', // Pink color to make it stand out
                fontWeight: 'bold', 
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
              }}
            >
              Admin 🛠️
            </Button>
          </Box>

          {/* LOGIN / PROFILE AREA */}
          <Box sx={{ flexGrow: 0 }}>
            <Button 
              variant="contained" 
              color="secondary"
              onClick={() => navigate('/login')}
              sx={{ borderRadius: 20 }}
            >
              Login
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;