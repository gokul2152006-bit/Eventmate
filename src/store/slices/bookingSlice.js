import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  bookings: [],
  currentBooking: null,
  isLoading: false,
  error: null,
  bookingHistory: [],
  upcomingBookings: [],
  pastBookings: [],
};

// Create slice
const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    // Set error
    setError: (state, action) => {
      state.error = action.payload;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Add a new booking (for both movies and events)
    addBooking: (state, action) => {
      const newBooking = {
        ...action.payload,
        id: action.payload.id || `BK${Date.now()}`,
        bookingDate: action.payload.bookingDate || new Date().toISOString(),
        bookingStatus: action.payload.bookingStatus || 'confirmed',
        createdAt: new Date().toISOString(),
      };
      
      state.bookings.unshift(newBooking);
      
      // Update booking history
      state.bookingHistory.unshift(newBooking);
      
      // Update upcoming/past bookings
      const eventDate = new Date(newBooking.date);
      const today = new Date();
      
      if (eventDate >= today) {
        state.upcomingBookings.unshift(newBooking);
      } else {
        state.pastBookings.unshift(newBooking);
      }
      
      // Save to localStorage for persistence
      try {
        const existingBookings = JSON.parse(localStorage.getItem('eventmate_bookings') || '[]');
        existingBookings.unshift(newBooking);
        localStorage.setItem('eventmate_bookings', JSON.stringify(existingBookings));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    },
    
    // Set current booking (during booking process)
    setCurrentBooking: (state, action) => {
      state.currentBooking = action.payload;
    },
    
    // Clear current booking
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
    
    // Update booking status
    updateBookingStatus: (state, action) => {
      const { bookingId, status } = action.payload;
      const booking = state.bookings.find(b => b.id === bookingId);
      if (booking) {
        booking.bookingStatus = status;
        booking.updatedAt = new Date().toISOString();
        
        // Update in specific arrays
        const bookingIndex = state.bookingHistory.findIndex(b => b.id === bookingId);
        if (bookingIndex !== -1) {
          state.bookingHistory[bookingIndex].bookingStatus = status;
        }
        
        const upcomingIndex = state.upcomingBookings.findIndex(b => b.id === bookingId);
        if (upcomingIndex !== -1) {
          state.upcomingBookings[upcomingIndex].bookingStatus = status;
        }
        
        const pastIndex = state.pastBookings.findIndex(b => b.id === bookingId);
        if (pastIndex !== -1) {
          state.pastBookings[pastIndex].bookingStatus = status;
        }
        
        // Update localStorage
        try {
          const existingBookings = JSON.parse(localStorage.getItem('eventmate_bookings') || '[]');
          const updatedBookings = existingBookings.map(b => 
            b.id === bookingId ? { ...b, bookingStatus: status, updatedAt: new Date().toISOString() } : b
          );
          localStorage.setItem('eventmate_bookings', JSON.stringify(updatedBookings));
        } catch (error) {
          console.error('Error updating localStorage:', error);
        }
      }
    },
    
    // Cancel a booking
    cancelBooking: (state, action) => {
      const bookingId = action.payload;
      const booking = state.bookings.find(b => b.id === bookingId);
      
      if (booking) {
        booking.bookingStatus = 'cancelled';
        booking.cancelledAt = new Date().toISOString();
        
        // Remove from upcoming bookings
        state.upcomingBookings = state.upcomingBookings.filter(b => b.id !== bookingId);
        
        // Add to past bookings if date has passed
        const eventDate = new Date(booking.date);
        const today = new Date();
        if (eventDate < today) {
          state.pastBookings.unshift(booking);
        }
        
        // Update localStorage
        try {
          const existingBookings = JSON.parse(localStorage.getItem('eventmate_bookings') || '[]');
          const updatedBookings = existingBookings.map(b => 
            b.id === bookingId ? { ...b, bookingStatus: 'cancelled', cancelledAt: new Date().toISOString() } : b
          );
          localStorage.setItem('eventmate_bookings', JSON.stringify(updatedBookings));
        } catch (error) {
          console.error('Error cancelling booking in localStorage:', error);
        }
      }
    },
    
    // Load bookings from localStorage
    loadBookingsFromStorage: (state) => {
      try {
        const storedBookings = JSON.parse(localStorage.getItem('eventmate_bookings') || '[]');
        state.bookings = storedBookings;
        state.bookingHistory = storedBookings;
        
        // Separate upcoming and past bookings
        const today = new Date();
        state.upcomingBookings = storedBookings.filter(booking => {
          const eventDate = new Date(booking.date);
          return eventDate >= today && booking.bookingStatus !== 'cancelled';
        });
        
        state.pastBookings = storedBookings.filter(booking => {
          const eventDate = new Date(booking.date);
          return eventDate < today || booking.bookingStatus === 'cancelled';
        });
      } catch (error) {
        console.error('Error loading bookings from localStorage:', error);
      }
    },
    
    // Load mock bookings (for demo)
    loadMockBookings: (state) => {
      const mockBookings = [
        {
          id: 'BK1001',
          eventId: '2',
          eventTitle: 'Coldplay: Music of the Spheres',
          date: '2024-01-25',
          time: '20:00',
          venue: 'DY Patil Stadium, Navi Mumbai',
          section: 'VIP Standing',
          ticketCount: 2,
          pricePerTicket: 8000,
          convenienceFee: 80,
          totalPrice: 16080,
          bookingType: 'event',
          paymentMethod: 'creditCard',
          paymentStatus: 'completed',
          transactionId: 'TXN78901234',
          bookingDate: '2024-01-10T14:30:00Z',
          bookingStatus: 'confirmed',
          userEmail: 'demo@example.com',
          userName: 'Demo User',
        },
        {
          id: 'BK1002',
          eventId: '3',
          eventTitle: 'IPL 2024: Mumbai Indians vs Chennai Super Kings',
          date: '2024-02-10',
          time: '19:30',
          venue: 'Wankhede Stadium, Mumbai',
          section: 'Premium Stand',
          ticketCount: 4,
          pricePerTicket: 2500,
          convenienceFee: 160,
          totalPrice: 10160,
          bookingType: 'event',
          paymentMethod: 'upi',
          paymentStatus: 'completed',
          transactionId: 'TXN78901235',
          bookingDate: '2024-01-12T11:20:00Z',
          bookingStatus: 'confirmed',
          userEmail: 'demo@example.com',
          userName: 'Demo User',
        },
        {
          id: 'BK1003',
          eventId: '4',
          eventTitle: 'Zakir Khan Stand-up Comedy',
          date: '2024-01-22',
          time: '19:00',
          venue: 'Royal Opera House, Mumbai',
          section: 'Front Row',
          ticketCount: 2,
          pricePerTicket: 1500,
          convenienceFee: 80,
          totalPrice: 3080,
          bookingType: 'event',
          paymentMethod: 'creditCard',
          paymentStatus: 'completed',
          transactionId: 'TXN78901236',
          bookingDate: '2024-01-08T16:45:00Z',
          bookingStatus: 'confirmed',
          userEmail: 'demo@example.com',
          userName: 'Demo User',
        },
        {
          id: 'BK1004',
          eventId: '1',
          eventTitle: 'Avatar: The Way of Water',
          date: '2024-01-20',
          time: '18:30',
          venue: 'PVR Cinemas, Mumbai',
          showtime: '06:30 PM',
          seats: ['A1', 'A2', 'A3'],
          ticketCount: 3,
          pricePerTicket: 450,
          convenienceFee: 120,
          totalPrice: 1470,
          bookingType: 'movie',
          paymentMethod: 'creditCard',
          paymentStatus: 'completed',
          transactionId: 'TXN78901237',
          bookingDate: '2024-01-05T10:15:00Z',
          bookingStatus: 'confirmed',
          userEmail: 'demo@example.com',
          userName: 'Demo User',
        },
      ];
      
      state.bookings = mockBookings;
      state.bookingHistory = mockBookings;
      
      // Separate upcoming and past bookings
      const today = new Date();
      state.upcomingBookings = mockBookings.filter(booking => {
        const eventDate = new Date(booking.date);
        return eventDate >= today;
      });
      
      state.pastBookings = mockBookings.filter(booking => {
        const eventDate = new Date(booking.date);
        return eventDate < today;
      });
      
      // Save to localStorage
      try {
        localStorage.setItem('eventmate_bookings', JSON.stringify(mockBookings));
      } catch (error) {
        console.error('Error saving mock bookings to localStorage:', error);
      }
    },
    
    // Clear all bookings (for testing)
    clearAllBookings: (state) => {
      state.bookings = [];
      state.bookingHistory = [];
      state.upcomingBookings = [];
      state.pastBookings = [];
      state.currentBooking = null;
      
      // Clear localStorage
      try {
        localStorage.removeItem('eventmate_bookings');
      } catch (error) {
        console.error('Error clearing localStorage:', error);
      }
    },
    
    // Get booking by ID
    getBookingById: (state, action) => {
      return state.bookings.find(booking => booking.id === action.payload);
    },
    
    // Get bookings by user email
    getBookingsByUser: (state, action) => {
      return state.bookings.filter(booking => booking.userEmail === action.payload);
    },
    
    // Get upcoming bookings
    getUpcomingBookings: (state) => {
      return state.upcomingBookings;
    },
    
    // Get past bookings
    getPastBookings: (state) => {
      return state.pastBookings;
    },
  },
});

// Export actions
export const {
  setLoading,
  setError,
  clearError,
  addBooking,
  setCurrentBooking,
  clearCurrentBooking,
  updateBookingStatus,
  cancelBooking,
  loadBookingsFromStorage,
  loadMockBookings,
  clearAllBookings,
  getBookingById,
  getBookingsByUser,
  getUpcomingBookings,
  getPastBookings,
} = bookingSlice.actions;

// Export reducer
export default bookingSlice.reducer;