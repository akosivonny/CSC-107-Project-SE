import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Box,
  Card,
  CardContent,
  Badge,
  Button,
} from '@mui/material';
import {
  Person as PersonIcon,
  School as SchoolIcon,
  Event as EventIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useUsers } from '../../contexts/UserContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { useCourses } from '../../contexts/CourseContext';

const Dashboard = () => {
  const { users, getUsersByRole, getRecentUsers, getTotalUsers } = useUsers();
  const { notifications, markAsRead, clearFailedNotifications } = useNotifications();
  const { courses } = useCourses();

  // Get recent registrations (last 7 days)
  const recentUsers = getRecentUsers(7);
  
  // Get role-based statistics
  const studentCount = getUsersByRole('student').length;
  const visitorCount = getUsersByRole('visitor').length;

  // Get unread notifications for admin
  const adminNotifications = notifications.filter(
    notification => notification.userId === 'admin' && !notification.read
  );

  const handleNotificationClick = (notificationId: string) => {
    markAsRead(notificationId);
  };

  const handleClearFailedNotifications = () => {
    clearFailedNotifications();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Statistics Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Users
              </Typography>
              <Typography variant="h4">
                {getTotalUsers()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Students
              </Typography>
              <Typography variant="h4">
                {studentCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Visitors
              </Typography>
              <Typography variant="h4">
                {visitorCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Courses
              </Typography>
              <Typography variant="h4">
                {courses.filter(course => course.status === 'active').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Registrations */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box display="flex" alignItems="center" mb={2}>
              <PersonIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Recent Registrations</Typography>
            </Box>
            <List>
              {recentUsers.map((user) => (
                <React.Fragment key={user.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={user.name}
                      secondary={`${user.email} - ${user.role.charAt(0).toUpperCase() + user.role.slice(1)} - Joined: ${new Date(user.joinDate).toLocaleDateString()}`}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
              {recentUsers.length === 0 && (
                <ListItem>
                  <ListItemText primary="No recent registrations" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Notifications */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Box display="flex" alignItems="center">
              <Badge badgeContent={adminNotifications.length} color="error" sx={{ mr: 1 }}>
                <NotificationsIcon />
              </Badge>
              <Typography variant="h6">System Notifications</Typography>
              </Box>
              <Button 
                variant="outlined" 
                color="error" 
                size="small"
                onClick={handleClearFailedNotifications}
              >
                Clear Failed
              </Button>
            </Box>
            <List>
              {adminNotifications.map((notification) => (
                <React.Fragment key={notification.id}>
                  <ListItem 
                    button 
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <ListItemText
                      primary={notification.title}
                      secondary={`${notification.message} - ${new Date(notification.createdAt).toLocaleString()}`}
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
              {adminNotifications.length === 0 && (
                <ListItem>
                  <ListItemText primary="No new notifications" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 