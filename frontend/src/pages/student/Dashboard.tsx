import React from 'react';
import { Box, Grid, Paper, Typography, Chip, Button } from '@mui/material';
import { 
  Event as EventIcon, 
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { usePreEnrollment } from '../../contexts/PreEnrollmentContext';
import { useAuth } from '../../contexts/AuthContext';
import { useCourses } from '../../contexts/CourseContext';
import { useNavigate } from 'react-router-dom';
import { Course, CourseStatus, EnrollmentStatus } from '../../types';

const Dashboard = () => {
  const { user } = useAuth();
  const { requests } = usePreEnrollment();
  const { courses } = useCourses();
  const navigate = useNavigate();

  // Filter pre-enrollment requests for the current user
  const userRequests = requests.filter(req => req.email === user?.email);

  // Get pending enrollment requests
  const pendingEnrollments = userRequests.filter(req => req.status === 'pending');

  const upcomingEvents = [
    {
      id: '1',
      title: 'Farm Visit Workshop',
      date: '2024-02-25',
      time: '10:00 AM',
    },
    {
      id: '2',
      title: 'Organic Certification Seminar',
      date: '2024-03-01',
      time: '2:00 PM',
    },
  ];

  const getStatusChip = (status: EnrollmentStatus) => {
    const statusProps = {
      pending: { color: 'warning' as const, label: 'Pending' },
      approved: { color: 'success' as const, label: 'Approved' },
      rejected: { color: 'error' as const, label: 'Rejected' },
    };
    return <Chip {...statusProps[status]} size="small" />;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Student Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Welcome back, {user?.name}!
      </Typography>

      <Grid container spacing={3}>
        {/* Pre-enrollment Status Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <AssignmentIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">Pre-enrollment Status</Typography>
            </Box>
            {pendingEnrollments.length > 0 ? (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Pending Requests:
                </Typography>
                {pendingEnrollments.map((request) => (
                  <Box key={request.id} sx={{ mb: 2 }}>
                    <Typography variant="body1">{request.courseId}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      {getStatusChip(request.status as EnrollmentStatus)}
                      <Typography variant="caption" sx={{ ml: 1 }}>
                        Submitted on {new Date(request.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body1" color="text.secondary">
                No pending pre-enrollment requests.
              </Typography>
            )}
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/student/enrollment')}
                fullWidth
              >
                Browse Courses
              </Button>
              <Button
                variant="outlined"
                endIcon={<SchoolIcon />}
                onClick={() => navigate('/student/enrolled-courses')}
                fullWidth
              >
                My Courses
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Upcoming Events Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <EventIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">Upcoming Events</Typography>
            </Box>
            <Grid container spacing={2}>
              {upcomingEvents.map((event) => (
                <Grid item xs={12} key={event.id}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 2,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      bgcolor: 'background.default',
                    }}
                  >
                    <Typography variant="subtitle1" gutterBottom>
                      {event.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Date: {event.date}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Time: {event.time}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 