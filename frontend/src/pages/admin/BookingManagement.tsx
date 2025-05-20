import React, { useState } from 'react';
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
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
} from '@mui/material';
import {
  Check as ApproveIcon,
  Close as RejectIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useBookings, Booking } from '../../contexts/BookingContext';
import { format } from 'date-fns';

interface FeedbackDialogProps {
  open: boolean;
  booking: Booking | null;
  onClose: () => void;
  onSubmit: (status: Booking['status'], feedback: string) => void;
}

const FeedbackDialog: React.FC<FeedbackDialogProps> = ({
  open,
  booking,
  onClose,
  onSubmit,
}) => {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (status: Booking['status']) => {
    onSubmit(status, feedback);
    setFeedback('');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Respond to Booking Request</DialogTitle>
      <DialogContent>
        {booking && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Visitor: {booking.visitorName}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Date: {format(new Date(booking.visitDate), 'PPP p')}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Group Size: {booking.groupSize} people
            </Typography>
            <Typography variant="body2" gutterBottom>
              Purpose: {booking.purpose}
            </Typography>
            <TextField
              fullWidth
              label="Feedback"
              multiline
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              sx={{ mt: 2 }}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={() => handleSubmit('rejected')}
          color="error"
          variant="contained"
        >
          Reject
        </Button>
        <Button
          onClick={() => handleSubmit('approved')}
          color="primary"
          variant="contained"
        >
          Approve
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const BookingManagement = () => {
  const { getAllBookings, updateBookingStatus, deleteBooking } = useBookings();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const bookings = getAllBookings();

  const handleStatusUpdate = (bookingId: string, status: 'approved' | 'rejected') => {
    updateBookingStatus(bookingId, status);
  };

  const handleDelete = (bookingId: string) => {
    deleteBooking(bookingId);
    setDeleteDialogOpen(false);
    setSelectedBooking(null);
  };

  const handleRespond = (booking: Booking) => {
    setSelectedBooking(booking);
    setDialogOpen(true);
  };

  const handleFeedbackSubmit = async (status: Booking['status'], feedback: string) => {
    if (selectedBooking) {
      await updateBookingStatus(selectedBooking.id, status, feedback);
      setDialogOpen(false);
      setSelectedBooking(null);
    }
  };

  const getStatusChip = (status: string) => {
    const statusProps = {
      pending: { color: 'warning' as const, label: 'Pending' },
      approved: { color: 'success' as const, label: 'Approved' },
      rejected: { color: 'error' as const, label: 'Rejected' },
    };
    return <Chip {...statusProps[status as keyof typeof statusProps]} size="small" />;
  };

  const getStatusChipColor = (status: Booking['status']) => {
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
      <Typography variant="h4" gutterBottom>
        Booking Management
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Visitor Name</TableCell>
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
                <TableCell>{booking.visitorName}</TableCell>
                <TableCell>
                  {format(new Date(booking.visitDate), 'PPP p')}
                </TableCell>
                <TableCell>{booking.groupSize}</TableCell>
                <TableCell>{booking.purpose}</TableCell>
                <TableCell>
                  <Chip
                    label={booking.status.toUpperCase()}
                    color={getStatusChipColor(booking.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                  {booking.status === 'pending' && (
                      <Tooltip title="Respond">
                        <IconButton
                      size="small"
                          color="primary"
                      onClick={() => handleRespond(booking)}
                    >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        color="info"
                        onClick={() => {
                          setSelectedBooking(booking);
                          setViewDialogOpen(true);
                        }}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => {
                          setSelectedBooking(booking);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* View Booking Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Booking Details</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Visitor Name</Typography>
                <Typography>{selectedBooking.visitorName}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Email</Typography>
                <Typography>{selectedBooking.email}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Visit Date</Typography>
                <Typography>
                  {format(new Date(selectedBooking.visitDate), 'PPP p')}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Group Size</Typography>
                <Typography>{selectedBooking.groupSize}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Purpose of Visit</Typography>
                <Typography>{selectedBooking.purpose}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Special Requirements</Typography>
                <Typography>
                  {selectedBooking.specialRequirements || 'None specified'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Status</Typography>
                {getStatusChip(selectedBooking.status)}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this booking? This action cannot be undone.
          </Typography>
          {selectedBooking && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2">Booking Details:</Typography>
              <Typography>Visitor: {selectedBooking.visitorName}</Typography>
              <Typography>Date: {format(new Date(selectedBooking.visitDate), 'PPP p')}</Typography>
              <Typography>Purpose: {selectedBooking.purpose}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => selectedBooking && handleDelete(selectedBooking.id)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <FeedbackDialog
        open={dialogOpen}
        booking={selectedBooking}
        onClose={() => {
          setDialogOpen(false);
          setSelectedBooking(null);
        }}
        onSubmit={handleFeedbackSubmit}
      />
    </Box>
  );
};

export default BookingManagement; 