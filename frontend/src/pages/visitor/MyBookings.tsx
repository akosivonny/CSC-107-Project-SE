import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { useBookings } from '../../contexts/BookingContext';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';
import { formatBookingPurpose } from '../../utils/formatters';

const MyBookings = () => {
  const { getVisitorBookings } = useBookings();
  const { user } = useAuth();
  const [selectedBooking, setSelectedBooking] = React.useState<any>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const bookings = user ? getVisitorBookings(user.email) : [];

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

  const handleViewDetails = (booking: any) => {
    setSelectedBooking(booking);
    setDialogOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Bookings
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Visit Date</TableCell>
              <TableCell>Group Size</TableCell>
              <TableCell>Purpose</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>
                  {format(new Date(booking.visitDate), 'PPP p')}
                </TableCell>
                <TableCell>{booking.groupSize}</TableCell>
                <TableCell>{formatBookingPurpose(booking.purpose)}</TableCell>
                <TableCell>
                  <Chip
                    label={booking.status.toUpperCase()}
                    color={getStatusChipColor(booking.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleViewDetails(booking)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {bookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No bookings found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Booking Details</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Visit Date: {format(new Date(selectedBooking.visitDate), 'PPP p')}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Group Size: {selectedBooking.groupSize} people
              </Typography>
              <Typography variant="body1" gutterBottom>
                Purpose: {formatBookingPurpose(selectedBooking.purpose)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Special Requirements: {selectedBooking.specialRequirements || 'None'}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Status: {selectedBooking.status.toUpperCase()}
                </Typography>
                {selectedBooking.adminFeedback && (
                  <>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
                      Admin Feedback:
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {selectedBooking.adminFeedback}
                    </Typography>
                  </>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyBookings; 