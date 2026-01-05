import AdminPage from './pages/AdminPage';
import React, { useState } from 'react'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container } from '@mui/material';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';

// Import Pages
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import CineplexPage from './pages/CineplexPage';
import SeatBookingPage from './pages/SeatBookingPage';
import EventBookingPage from './pages/EventBookingPage';
import PaymentPage from './pages/PaymentPage';
import ConfirmationPage from './pages/ConfirmationPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import MyBookingsPage from './pages/MyBookingsPage';

// Import Components
import Header from './components/common/Header';
import ProtectedRoute from './components/common/ProtectedRoute';

// --- IMPORTS FOR CHATBOT ---
import ChatWindow from "./components/Chatbot/ChatWindow"; 
import "./components/Chatbot/styles.css"; 
// -------------------------------

// Create theme
const theme = createTheme({
  palette: {
    primary: { 
      main: '#3f51b5',
      light: '#757de8',
      dark: '#002984',
    },
    secondary: { 
      main: '#f50057',
      light: '#ff4081',
      dark: '#c51162',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    success: {
      main: '#4caf50',
    },
    warning: {
      main: '#ff9800',
    },
    error: {
      main: '#f44336',
    },
    info: {
      main: '#2196f3',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      '@media (min-width:600px)': {
        fontSize: '3rem',
      },
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      '@media (min-width:600px)': {
        fontSize: '2.5rem',
      },
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      '@media (min-width:600px)': {
        fontSize: '2rem',
      },
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 20px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #3f51b5 0%, #757de8 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #002984 0%, #3f51b5 100%)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #f50057 0%, #ff4081 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #c51162 0%, #f50057 100%)',
          },
        },
        sizeLarge: {
          padding: '12px 32px',
          fontSize: '1.1rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        },
        elevation2: {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        },
        elevation3: {
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #3f51b5 0%, #757de8 100%)',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

function App() {
  // --- STATE FOR CHATBOT ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  // -------------------------

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <div style={{ 
              minHeight: '100vh', 
              display: 'flex', 
              flexDirection: 'column',
              backgroundColor: '#f8f9fa',
              position: 'relative'
            }}>
              <Header />
              <Container 
                maxWidth="xl" 
                sx={{ 
                  mt: 2, 
                  mb: 4, 
                  flex: 1,
                  '@media (max-width: 600px)': {
                    px: 2,
                  },
                }}
              >
                <Routes>
                  {/* ========== PUBLIC ROUTES ========== */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/events" element={<EventsPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  
                  {/* Movie Booking Flow Routes */}
                  <Route path="/cineplex/:eventId" element={<CineplexPage />} />
                  
                  {/* ========== PROTECTED ROUTES (Require Login) ========== */}
                  
                  {/* Movie Booking Flow */}
                  <Route 
                    path="/booking/:showId" 
                    element={
                      <ProtectedRoute>
                        <SeatBookingPage />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Event Booking Flow */}
                  <Route 
                    path="/event-booking/:eventId" 
                    element={
                      <ProtectedRoute>
                        <EventBookingPage />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Payment */}
                  <Route 
                    path="/payment" 
                    element={
                      <ProtectedRoute>
                        <PaymentPage />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Confirmation */}
                  <Route 
                    path="/confirmation" 
                    element={
                      <ProtectedRoute>
                        <ConfirmationPage />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Profile & Bookings */}
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/bookings" 
                    element={
                      <ProtectedRoute>
                        <MyBookingsPage />
                      </ProtectedRoute>
                    } 
                  />

                  {/* ✅ ADMIN ROUTE ADDED HERE ✅ */}
                  <Route path="/admin" element={<AdminPage />} />
                  
                  {/* ========== 404 PAGE ========== */}
                  <Route 
                    path="*" 
                    element={
                      <div style={{ 
                        textAlign: 'center', 
                        padding: '100px 20px',
                        minHeight: '60vh',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                        <div style={{ 
                          fontSize: '8rem', 
                          fontWeight: 'bold',
                          background: 'linear-gradient(135deg, #3f51b5 0%, #757de8 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          marginBottom: '1rem',
                        }}>
                          404
                        </div>
                        <h2 style={{ 
                          fontSize: '2rem', 
                          marginBottom: '1rem',
                          color: '#333',
                        }}>
                          Page Not Found
                        </h2>
                        <p style={{ 
                          fontSize: '1.1rem', 
                          color: '#666',
                          marginBottom: '2rem',
                          maxWidth: '500px',
                        }}>
                          The page you're looking for doesn't exist or has been moved.
                        </p>
                        <a 
                          href="/" 
                          style={{ 
                            padding: '12px 32px',
                            background: 'linear-gradient(135deg, #3f51b5 0%, #757de8 100%)',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '8px',
                            fontWeight: '600',
                            fontSize: '1rem',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 12px rgba(63, 81, 181, 0.3)',
                          }}
                          onMouseOver={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 6px 20px rgba(63, 81, 181, 0.4)';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 12px rgba(63, 81, 181, 0.3)';
                          }}
                        >
                          Go to Homepage
                        </a>
                      </div>
                    } 
                  />
                </Routes>
              </Container>
              
              {/* ========== FOOTER ========== */}
              <footer style={{ 
                backgroundColor: '#1a237e',
                color: 'white',
                padding: '40px 0 20px 0',
                marginTop: 'auto',
                background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
              }}>
                <Container maxWidth="xl">
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '40px',
                    marginBottom: '40px',
                  }}>
                    {/* Company Info */}
                    <div>
                      <h3 style={{ margin: '0 0 20px 0', fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' }}>
                        EventMate
                      </h3>
                      <p style={{ margin: '0', opacity: 0.9, lineHeight: '1.6', color: '#e8eaf6' }}>
                        Your ultimate destination for event bookings. 
                        Discover, book, and enjoy amazing experiences.
                      </p>
                    </div>
                    
                    {/* Quick Links */}
                    <div>
                      <h4 style={{ margin: '0 0 20px 0', fontSize: '1.1rem', fontWeight: '600', color: '#fff' }}>
                        Quick Links
                      </h4>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        <li style={{ marginBottom: '12px' }}>
                          <a href="/" style={{ color: '#e8eaf6', textDecoration: 'none', opacity: 0.9 }}>Home</a>
                        </li>
                        <li style={{ marginBottom: '12px' }}>
                          <a href="/events" style={{ color: '#e8eaf6', textDecoration: 'none', opacity: 0.9 }}>Events</a>
                        </li>
                        <li style={{ marginBottom: '12px' }}>
                          <a href="/bookings" style={{ color: '#e8eaf6', textDecoration: 'none', opacity: 0.9 }}>My Bookings</a>
                        </li>
                        <li style={{ marginBottom: '12px' }}>
                          <a href="/profile" style={{ color: '#e8eaf6', textDecoration: 'none', opacity: 0.9 }}>Profile</a>
                        </li>
                      </ul>
                    </div>
                    
                    {/* Legal */}
                    <div>
                      <h4 style={{ margin: '0 0 20px 0', fontSize: '1.1rem', fontWeight: '600', color: '#fff' }}>
                        Legal
                      </h4>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        <li style={{ marginBottom: '12px' }}>
                          <a href="/terms" style={{ color: '#e8eaf6', textDecoration: 'none', opacity: 0.9 }}>Terms of Service</a>
                        </li>
                        <li style={{ marginBottom: '12px' }}>
                          <a href="/privacy" style={{ color: '#e8eaf6', textDecoration: 'none', opacity: 0.9 }}>Privacy Policy</a>
                        </li>
                        <li style={{ marginBottom: '12px' }}>
                          <a href="/refund" style={{ color: '#e8eaf6', textDecoration: 'none', opacity: 0.9 }}>Refund Policy</a>
                        </li>
                        <li style={{ marginBottom: '12px' }}>
                          <a href="/cancellation" style={{ color: '#e8eaf6', textDecoration: 'none', opacity: 0.9 }}>Cancellation Policy</a>
                        </li>
                      </ul>
                    </div>
                    
                    {/* Contact */}
                    <div>
                      <h4 style={{ margin: '0 0 20px 0', fontSize: '1.1rem', fontWeight: '600', color: '#fff' }}>
                        Contact Us
                      </h4>
                      <p style={{ margin: '0 0 12px 0', opacity: 0.9, color: '#e8eaf6' }}>📧 support@eventmate.com</p>
                      <p style={{ margin: '0 0 12px 0', opacity: 0.9, color: '#e8eaf6' }}>📞 +91 7339288014</p>
                      <p style={{ margin: '0', opacity: 0.9, color: '#e8eaf6' }}>🏢 Mumbai, Maharashtra, India</p>
                    </div>
                  </div>
                  
                  {/* Copyright */}
                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '20px', textAlign: 'center' }}>
                    <p style={{ margin: '0', opacity: 0.7, fontSize: '0.9rem', color: '#e8eaf6' }}>
                      © {new Date().getFullYear()} EventMate. All rights reserved.
                    </p>
                  </div>
                </Container>
              </footer>

              {/* ========== CHATBOT WIDGET ========== */}
              <div className="chat-widget-container">
                {isChatOpen && <ChatWindow />}
                <button 
                  className="chat-toggle-btn" 
                  onClick={() => setIsChatOpen(!isChatOpen)}
                >
                  {isChatOpen ? "✖" : "💬"} 
                </button>
              </div>

            </div>
          </Router>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;