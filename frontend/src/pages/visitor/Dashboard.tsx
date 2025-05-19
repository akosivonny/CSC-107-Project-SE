import React from 'react';
import { Box, Grid, Paper, Typography, Button, Chip } from '@mui/material';
import {
  Tour as TourIcon,
  Event as EventIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useBookings } from '../../contexts/BookingContext';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';
import { formatBookingPurpose } from '../../utils/formatters';

const Dashboard = () => {
  const navigate = useNavigate();
  const { getVisitorBookings } = useBookings();
  const { user } = useAuth();
  
  const upcomingTours = [
    {
      id: '1',
      title: 'Organic Farm Tour',
      date: '2024-02-28',
      time: '9:00 AM',
      spotsLeft: 5,
    },
    {
      id: '2',
      title: 'Livestock Management Tour',
      date: '2024-03-05',
      time: '2:00 PM',
      spotsLeft: 3,
    },
  ];

  // Get recent bookings from context
  const recentBookings = user ? getVisitorBookings(user.email) : [];

  const getStatusChipColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'warning';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Visitor Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<TourIcon />}
                onClick={() => navigate('/visitor/tour')}
              >
                Start Virtual Tour
              </Button>
              <Button
                variant="contained"
                startIcon={<CalendarIcon />}
                onClick={() => navigate('/visitor/book')}
              >
                Book a Visit
              </Button>
              <Button
                variant="outlined"
                startIcon={<EventIcon />}
                onClick={() => navigate('/visitor/my-bookings')}
              >
                View My Bookings
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Recent Bookings */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <EventIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">Recent Bookings</Typography>
            </Box>
            {recentBookings.length > 0 ? (
              recentBookings.slice(0, 3).map((booking) => (
                <Box
                  key={booking.id}
                  sx={{
                    mb: 2,
                    p: 2,
                    bgcolor: 'background.default',
                    borderRadius: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1">
                      Visit on {format(new Date(booking.visitDate), 'PPP p')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Group Size: {booking.groupSize} • Purpose: {formatBookingPurpose(booking.purpose)}
                    </Typography>
                  </Box>
                  <Chip
                    label={booking.status.toUpperCase()}
                    color={getStatusChipColor(booking.status)}
                    size="small"
                  />
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No bookings found. Why not book a visit?
              </Typography>
            )}
            {recentBookings.length > 0 && (
              <Box sx={{ mt: 2, textAlign: 'right' }}>
                <Button
                  variant="text"
                  onClick={() => navigate('/visitor/my-bookings')}
                >
                  View All Bookings
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Upcoming Tours */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <TourIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">Upcoming Tours</Typography>
            </Box>
            {upcomingTours.map((tour) => (
              <Box
                key={tour.id}
                sx={{
                  mb: 2,
                  p: 2,
                  bgcolor: 'background.default',
                  borderRadius: 1,
                }}
              >
                <Typography variant="subtitle1">{tour.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {tour.date} at {tour.time}
                </Typography>
                <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                  {tour.spotsLeft} spots remaining
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 