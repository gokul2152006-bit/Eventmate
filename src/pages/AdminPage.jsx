import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  TextField, 
  DialogActions,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'; // Make sure @mui/icons-material is installed

const AdminPage = () => {
  // --- STATE FOR MOVIES ---
  const [openMovie, setOpenMovie] = useState(false);
  const [movieData, setMovieData] = useState({ title: '', imageUrl: '', genre: '', price: '' });

  // --- STATE FOR USERS ---
  const [openUsers, setOpenUsers] = useState(false);
  // Dummy data for users (In real app, this comes from database)
  const [users, setUsers] = useState([
    { id: 1, name: 'Gokulnath Rao', email: 'gokul@example.com', role: 'Admin' },
    { id: 2, name: 'John Doe', email: 'john@test.com', role: 'User' },
    { id: 3, name: 'Jane Smith', email: 'jane@test.com', role: 'User' },
  ]);

  // --- STATE FOR NOTIFICATIONS ---
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState('');

  // --- MOVIE HANDLERS ---
  const handleOpenMovie = () => setOpenMovie(true);
  const handleCloseMovie = () => setOpenMovie(false);
  
  const handleMovieChange = (e) => {
    setMovieData({ ...movieData, [e.target.name]: e.target.value });
  };

  const handleSaveMovie = () => {
    console.log("Movie Saved:", movieData);
    setMessage("Movie Added Successfully! 🎬");
    setOpenMovie(false);
    setShowSuccess(true);
  };

  // --- USER HANDLERS ---
  const handleOpenUsers = () => setOpenUsers(true);
  const handleCloseUsers = () => setOpenUsers(false);

  const handleDeleteUser = (id) => {
    // Filter out the user with the given ID
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
    setMessage("User Deleted Successfully! 🗑️");
    setShowSuccess(true);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold', color: '#1a237e' }}>
        Admin Dashboard 🛠️
      </Typography>
      
      {/* --- STATS SECTION --- */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: '#e3f2fd' }}>
            <CardContent>
              <Typography variant="h6">Total Bookings</Typography>
              <Typography variant="h3">1,245</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: '#ffebee' }}>
            <CardContent>
              <Typography variant="h6">Total Revenue</Typography>
              <Typography variant="h3">$12,400</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Quick Actions</Typography>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                
                {/* BUTTON 1: ADD MOVIE */}
                <Button variant="contained" color="primary" onClick={handleOpenMovie}>
                  Add New Movie
                </Button>
                
                {/* BUTTON 2: MANAGE USERS */}
                <Button variant="contained" color="secondary" onClick={handleOpenUsers}>
                  Manage Users
                </Button>

              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* --- POPUP 1: ADD MOVIE --- */}
      <Dialog open={openMovie} onClose={handleCloseMovie}>
        <DialogTitle>Add a New Movie 🎬</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" name="title" label="Movie Title" fullWidth variant="outlined" onChange={handleMovieChange} />
          <TextField margin="dense" name="imageUrl" label="Image URL" fullWidth variant="outlined" onChange={handleMovieChange} />
          <TextField margin="dense" name="genre" label="Genre" fullWidth variant="outlined" onChange={handleMovieChange} />
          <TextField margin="dense" name="price" label="Price ($)" type="number" fullWidth variant="outlined" onChange={handleMovieChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMovie} color="error">Cancel</Button>
          <Button onClick={handleSaveMovie} variant="contained" color="primary">Save Movie</Button>
        </DialogActions>
      </Dialog>

      {/* --- POPUP 2: MANAGE USERS --- */}
      <Dialog open={openUsers} onClose={handleCloseUsers} maxWidth="md" fullWidth>
        <DialogTitle>User Management 👥</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper} elevation={0} variant="outlined">
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Role</strong></TableCell>
                  <TableCell align="right"><strong>Action</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        fontSize: '0.8rem',
                        backgroundColor: user.role === 'Admin' ? '#e3f2fd' : '#f5f5f5',
                        color: user.role === 'Admin' ? '#1976d2' : '#666'
                      }}>
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton color="error" onClick={() => handleDeleteUser(user.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">No users found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUsers}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* --- SUCCESS NOTIFICATION --- */}
      <Snackbar open={showSuccess} autoHideDuration={3000} onClose={() => setShowSuccess(false)}>
        <Alert severity="success" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>

    </Container>
  );
};

export default AdminPage;