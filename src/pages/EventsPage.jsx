import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  Box,
  Chip,
  Container,
  InputAdornment,
  Rating,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material';
import { 
  Search, 
  LocationOn, 
  CalendarMonth, 
  AccessTime,
  LocalOffer,
  FilterList,
  Movie,
  MusicNote,
  Sports,
  Tag,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import mockEvents from '../data/mockEvents';

const EventsPage = () => {
  const navigate = useNavigate();
  const [events] = useState(mockEvents);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  const categories = ['all', 'Movie', 'Concert', 'Sports', 'Comedy'];

  const handleEventClick = (event) => {
    console.log('Event clicked:', event);
    console.log('Event type:', event.type);
    
    // Store event in localStorage for backup
    localStorage.setItem('selectedEvent', JSON.stringify(event));
    
    if (event.type === 'cineplex') {
      // For movies, go to cineplex page first
      navigate(`/cineplex/${event.id}`);
    } else {
      // For concerts, sports, comedy - direct to event booking
      navigate(`/event-booking/${event.id}`);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.venue.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    
    let matchesPrice = true;
    if (priceRange === 'low') matchesPrice = event.price <= 500;
    if (priceRange === 'medium') matchesPrice = event.price > 500 && event.price <= 1500;
    if (priceRange === 'high') matchesPrice = event.price > 1500;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Movie': return <Movie />;
      case 'Concert': return <MusicNote />;
      case 'Sports': return <Sports />;
      case 'Comedy': return <Tag />;
      default: return <Movie />;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
          Discover Amazing Events
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Book tickets for your favorite movies, concerts, sports & more
        </Typography>
      </Box>

      {/* Filters Section */}
      <Paper sx={{ 
        mb: 4, 
        p: 3, 
        backgroundColor: 'white', 
        borderRadius: 2,
        boxShadow: 3
      }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search events, venues, categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                label="Category"
                onChange={(e) => setSelectedCategory(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <FilterList />
                  </InputAdornment>
                }
              >
                {categories.map(category => (
                  <MenuItem key={category} value={category}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {getCategoryIcon(category)}
                      <Typography sx={{ ml: 1 }}>
                        {category === 'all' ? 'All Categories' : category}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Price Range</InputLabel>
              <Select
                value={priceRange}
                label="Price Range"
                onChange={(e) => setPriceRange(e.target.value)}
              >
                <MenuItem value="all">All Prices</MenuItem>
                <MenuItem value="low">Under ₹500</MenuItem>
                <MenuItem value="medium">₹500 - ₹1500</MenuItem>
                <MenuItem value="high">Above ₹1500</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setPriceRange('all');
              }}
              sx={{ height: '56px' }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Events Grid */}
      <Grid container spacing={3}>
        {filteredEvents.map((event) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={event.id}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': { 
                transform: 'translateY(-8px)',
                boxShadow: 6
              }
            }}>
              {/* Event Image */}
              <CardMedia
                component="img"
                height="200"
                image={event.image}
                alt={event.title}
                sx={{
                  objectFit: 'cover',
                }}
              />
              
              <CardContent sx={{ flexGrow: 1, p: 2 }}>
                {/* Event Category & Rating */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Chip 
                    icon={getCategoryIcon(event.category)}
                    label={event.category} 
                    color="primary" 
                    size="small"
                    sx={{ fontWeight: 'bold' }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Rating value={event.rating} precision={0.5} size="small" readOnly />
                    <Typography variant="body2" sx={{ ml: 0.5, fontWeight: 'bold' }}>
                      {event.rating}
                    </Typography>
                  </Box>
                </Box>

                {/* Event Title */}
                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ 
                  fontSize: '1rem',
                  height: '48px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {event.title}
                </Typography>

                {/* Event Details */}
                <Box sx={{ mt: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <CalendarMonth fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" fontSize="0.85rem">
                      {new Date(event.date).toLocaleDateString('en-US', { 
                        day: 'numeric', 
                        month: 'short' 
                      })}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <AccessTime fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" fontSize="0.85rem">{event.time}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" fontSize="0.85rem" sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {event.venue}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocalOffer fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="h6" color="primary" fontWeight="bold">
                        ₹{event.price}
                      </Typography>
                    </Box>
                    <Chip 
                      label={event.type === 'cineplex' ? 'Movie' : event.category} 
                      size="small" 
                      variant="outlined"
                      color="secondary"
                    />
                  </Box>
                </Box>
              </CardContent>

              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => handleEventClick(event)}
                  sx={{ 
                    fontWeight: 'bold',
                    py: 1,
                    backgroundColor: event.type === 'cineplex' ? '#1976d2' : '#f50057',
                    '&:hover': {
                      backgroundColor: event.type === 'cineplex' ? '#1565c0' : '#c51162',
                    }
                  }}
                >
                  {event.type === 'cineplex' ? 'View Showtimes' : 'Book Now'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* No Results Message */}
      {filteredEvents.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Alert severity="info" sx={{ maxWidth: 500, mx: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              No events found
            </Typography>
            <Typography>
              Try adjusting your search or filter criteria
            </Typography>
          </Alert>
        </Box>
      )}
    </Container>
  );
};

// Add Paper import
const Paper = ({ children, sx, ...props }) => (
  <Box
    sx={{
      p: 2,
      bgcolor: 'background.paper',
      borderRadius: 2,
      boxShadow: 1,
      ...sx
    }}
    {...props}
  >
    {children}
  </Box>
);

export default EventsPage;