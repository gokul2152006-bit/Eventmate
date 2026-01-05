import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Container,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  LocalMovies, 
  MusicNote, 
  Sports, 
  TheaterComedy,
  ArrowForward
} from '@mui/icons-material';

const HomePage = () => {
  const navigate = useNavigate();

  const categories = [
    { 
      name: 'Movies', 
      icon: <LocalMovies sx={{ fontSize: 50 }} />, 
      color: '#3f51b5',
      description: 'Latest blockbusters & classics'
    },
    { 
      name: 'Concerts', 
      icon: <MusicNote sx={{ fontSize: 50 }} />, 
      color: '#f50057',
      description: 'Live music performances'
    },
    { 
      name: 'Sports', 
      icon: <Sports sx={{ fontSize: 50 }} />, 
      color: '#4caf50',
      description: 'Games & tournaments'
    },
    { 
      name: 'Comedy Shows', 
      icon: <TheaterComedy sx={{ fontSize: 50 }} />, 
      color: '#ff9800',
      description: 'Stand-up & improv'
    },
  ];

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box sx={{ 
        textAlign: 'center', 
        py: 8,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 3,
        color: 'white',
        mb: 8,
        px: 4,
        boxShadow: 3
      }}>
        <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
          Welcome to EventMate
        </Typography>
        <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
          Your one-stop destination for booking movies, events, and shows
        </Typography>
        
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/events')}
          sx={{ 
            mb: 2, 
            px: 6, 
            py: 1.5,
            backgroundColor: 'white',
            color: '#667eea',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#f5f5f5',
              transform: 'translateY(-2px)',
              transition: '0.3s'
            }
          }}
          endIcon={<ArrowForward />}
        >
          Explore All Events
        </Button>
      </Box>

      {/* Categories Section */}
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center' }}>
        Browse Categories
      </Typography>
      
      <Grid container spacing={4} justifyContent="center" sx={{ mb: 8 }}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={3} key={category.name}>
            <Card
              sx={{
                textAlign: 'center',
                p: 3,
                cursor: 'pointer',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                transition: 'all 0.3s',
                '&:hover': { 
                  transform: 'translateY(-8px)',
                  boxShadow: 6 
                },
                borderTop: `4px solid ${category.color}`
              }}
              onClick={() => navigate('/events')}
            >
              <Box sx={{ 
                color: category.color, 
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {category.icon}
              </Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {category.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {category.description}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Call to Action */}
      <Box sx={{ textAlign: 'center', py: 6, backgroundColor: '#f8f9fa', borderRadius: 3 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
          Ready to book your next experience?
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate('/events')}
          sx={{ px: 6, py: 1.5 }}
        >
          Get Started Now
        </Button>
      </Box>
    </Container>
  );
};

export default HomePage;