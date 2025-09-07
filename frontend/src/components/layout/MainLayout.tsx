import React from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Book as BookIcon,
  Tour as TourIcon,
  Event as EventIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  Assignment as EnrollmentIcon,
  School as SchoolIcon,
  CalendarMonth as BookingIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 240;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const getMenuItems = () => {
    const baseItems = [
      {
        text: 'Profile',
        icon: <PersonIcon />,
        onClick: () => navigate('/profile'),
      },
    ];

    const roleSpecificItems = {
      admin: [
        {
          text: 'Dashboard',
          icon: <DashboardIcon />,
          onClick: () => navigate('/admin/dashboard'),
        },
        {
          text: 'Pre-Enrollments',
          icon: <EnrollmentIcon />,
          onClick: () => navigate('/admin/pre-enrollments'),
        },
        {
          text: 'User Management',
          icon: <PeopleIcon />,
          onClick: () => navigate('/admin/users'),
        },
        {
          text: 'Course Management',
          icon: <BookIcon />,
          onClick: () => navigate('/admin/courses'),
        },
        {
          text: 'Booking Management',
          icon: <BookingIcon />,
          onClick: () => navigate('/admin/bookings'),
        },
        {
          text: 'Virtual Event',
          icon: <EventIcon />,
          onClick: () => navigate('/admin/virtual-event'),
        },
      ],
      student: [
        {
          text: 'Dashboard',
          icon: <DashboardIcon />,
          onClick: () => navigate('/student/dashboard'),
        },
        {
          text: 'Course Enrollment',
          icon: <BookIcon />,
          onClick: () => navigate('/student/enrollment'),
        },
        {
          text: 'My Courses',
          icon: <SchoolIcon />,
          onClick: () => navigate('/student/enrolled-courses'),
        },
      ],
      visitor: [
        {
          text: 'Dashboard',
          icon: <DashboardIcon />,
          onClick: () => navigate('/visitor/dashboard'),
        },
        {
          text: 'Virtual Tour',
          icon: <TourIcon />,
          onClick: () => navigate('/visitor/tour'),
        },
        {
          text: 'Book Visit',
          icon: <EventIcon />,
          onClick: () => navigate('/visitor/book'),
        },
        {
          text: 'My Bookings',
          icon: <BookingIcon />,
          onClick: () => navigate('/visitor/my-bookings'),
        },
      ],
    };

    return [
      ...(user ? roleSpecificItems[user.role] : []),
      ...baseItems,
      {
        text: 'Logout',
        icon: <LogoutIcon />,
        onClick: () => {
          logout();
          navigate('/login');
        },
      },
    ];
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Eutiquio Integrated Farm
        </Typography>
      </Toolbar>
      <List>
        {getMenuItems().map((item) => (
          <ListItem button key={item.text} onClick={item.onClick}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''} Dashboard
          </Typography>
          <Button color="inherit" onClick={() => navigate('/profile')}>
            {user?.name}
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout; 