import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Divider,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useBookings } from '../../contexts/BookingContext';
import { useAuth } from '../../contexts/AuthContext';

interface BookingFormData {
  visitorName: string;
  email: string;
  visitDate: Date | null;
  visitTime: Date | null;
  groupSize: string;
  purpose: string;
  specialRequirements: string;
}

const initialFormData: BookingFormData = {
  visitorName: '',
  email: '',
  visitDate: null,
  visitTime: null,
  groupSize: '',
  purpose: '',
  specialRequirements: '',
};

const BookingSystem = () => {
  const { addBooking } = useBookings();
  const { user } = useAuth();
  const [formData, setFormData] = useState<BookingFormData>({
    ...initialFormData,
    visitorName: user?.name || '',
    email: user?.email || '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormData, string>>>(
    {}
  );
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const validateForm = () => {
    const newErrors: Partial<Record<keyof BookingFormData, string>> = {};
    let isValid = true;

    if (!formData.visitorName) {
      newErrors.visitorName = 'Name is required';
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }

    if (!formData.visitDate) {
      newErrors.visitDate = 'Visit date is required';
      isValid = false;
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (formData.visitDate < today) {
        newErrors.visitDate = 'Visit date cannot be in the past';
        isValid = false;
      }
    }

    if (!formData.visitTime) {
      newErrors.visitTime = 'Visit time is required';
      isValid = false;
    }

    if (!formData.groupSize) {
      newErrors.groupSize = 'Group size is required';
      isValid = false;
    } else {
      const size = parseInt(formData.groupSize);
      if (isNaN(size) || size < 1) {
        newErrors.groupSize = 'Group size must be at least 1';
        isValid = false;
      } else if (size > 15) {
        newErrors.groupSize = 'Maximum group size is 15 people';
        isValid = false;
      }
    }

    if (!formData.purpose) {
      newErrors.purpose = 'Purpose of visit is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        // Combine date and time for a complete timestamp
        let visitDateTime = null;
        if (formData.visitDate && formData.visitTime) {
          visitDateTime = new Date(formData.visitDate);
          visitDateTime.setHours(formData.visitTime.getHours());
          visitDateTime.setMinutes(formData.visitTime.getMinutes());
        }

        await addBooking({
          visitorName: formData.visitorName,
          email: formData.email,
          visitDate: visitDateTime?.toISOString() || '',
          groupSize: parseInt(formData.groupSize),
          purpose: formData.purpose,
          specialRequirements: formData.specialRequirements,
        });

        setSnackbar({
          open: true,
          message: 'Booking request submitted successfully!',
          severity: 'success',
        });

        setFormData(initialFormData);
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Failed to submit booking request. Please try again.',
          severity: 'error',
        });
      }
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Book a Farm Visit
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Schedule a visit to our farm and experience sustainable agriculture firsthand.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={formData.visitorName}
                      onChange={(e) =>
                        setFormData({ ...formData, visitorName: e.target.value })
                      }
                      error={!!errors.visitorName}
                      helperText={errors.visitorName}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      error={!!errors.email}
                      helperText={errors.email}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label="Visit Date"
                      value={formData.visitDate}
                      onChange={(date) =>
                        setFormData({ ...formData, visitDate: date })
                      }
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                          error: !!errors.visitDate,
                          helperText: errors.visitDate,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TimePicker
                      label="Visit Time"
                      value={formData.visitTime}
                      onChange={(time) =>
                        setFormData({ ...formData, visitTime: time })
                      }
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                          error: !!errors.visitTime,
                          helperText: errors.visitTime,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Group Size"
                      type="number"
                      value={formData.groupSize}
                      onChange={(e) =>
                        setFormData({ ...formData, groupSize: e.target.value })
                      }
                      error={!!errors.groupSize}
                      helperText={errors.groupSize || 'Enter number of visitors (max 15)'}
                      required
                      inputProps={{
                        min: 1,
                        max: 15,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth error={!!errors.purpose} required>
                      <InputLabel>Purpose of Visit</InputLabel>
                      <Select
                        value={formData.purpose}
                        onChange={(e) =>
                          setFormData({ ...formData, purpose: e.target.value })
                        }
                        label="Purpose of Visit"
                      >
                        <MenuItem value="educational">Educational Tour</MenuItem>
                        <MenuItem value="business">Business Visit</MenuItem>
                        <MenuItem value="leisure">Leisure Visit</MenuItem>
                        <MenuItem value="workshop">Workshop Participation</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </Select>
                      {errors.purpose && (
                        <FormHelperText>{errors.purpose}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Special Requirements (Optional)"
                      multiline
                      rows={3}
                      value={formData.specialRequirements}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specialRequirements: e.target.value,
                        })
                      }
                      helperText="Please mention any special requirements or accommodations needed"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                    >
                      Submit Booking Request
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Visiting Hours & Guidelines
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom>
                Opening Hours
              </Typography>
              <Typography variant="body2" paragraph>
                Monday - Saturday: 9:00 AM - 5:00 PM
                <br />
                Sunday: 10:00 AM - 4:00 PM
              </Typography>

              <Typography variant="subtitle2" gutterBottom>
                Important Notes
              </Typography>
              <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
                <li>Bookings must be made at least 24 hours in advance</li>
                <li>Maximum group size is 15 people</li>
                <li>Wear appropriate footwear for farm conditions</li>
                <li>Children must be accompanied by adults</li>
              </Typography>

              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                Cancellation Policy
              </Typography>
              <Typography variant="body2">
                Please notify us at least 24 hours before your scheduled visit if
                you need to cancel or reschedule.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default BookingSystem; 