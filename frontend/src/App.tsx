import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import MainLayout from './components/layout/MainLayout';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import { PreEnrollmentProvider } from './contexts/PreEnrollmentContext';
import { CourseProvider, useCourses } from './contexts/CourseContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { BookingProvider } from './contexts/BookingContext';
import { UserRole } from './types';
import { defaultCourses } from './utils/defaultCourses';
import { VirtualEventProvider } from './contexts/VirtualEventContext';

// Lazy load components
const Login = React.lazy(() => import('./pages/auth/Login'));
const Register = React.lazy(() => import('./pages/auth/Register'));
const AdminDashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const StudentDashboard = React.lazy(() => import('./pages/student/Dashboard'));
const VisitorDashboard = React.lazy(() => import('./pages/visitor/Dashboard'));
const UserManagement = React.lazy(() => import('./pages/admin/UserManagement'));
const CourseManagement = React.lazy(() => import('./pages/admin/CourseManagement'));
const BookingManagement = React.lazy(() => import('./pages/admin/BookingManagement'));
const VirtualTour = React.lazy(() => import('./pages/visitor/VirtualTour'));
const BookingSystem = React.lazy(() => import('./pages/visitor/BookingSystem'));
const CourseEnrollment = React.lazy(() => import('./pages/student/CourseEnrollment'));
const OfferedCourses = React.lazy(() => import('./pages/student/OfferedCourses'));
const EnrolledCourses = React.lazy(() => import('./pages/student/EnrolledCourses'));
const Profile = React.lazy(() => import('./pages/Profile'));
const PreEnrollmentManagement = React.lazy(() => import('./pages/admin/PreEnrollmentManagement'));
const MyBookings = React.lazy(() => import('./pages/visitor/MyBookings'));
const VirtualEvent = React.lazy(() => import('./pages/admin/VirtualEvent'));

const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Green shade for farm theme
    },
    secondary: {
      main: '#ff8f00', // Orange shade for contrast
    },
  },
});

// Protected Route wrapper component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: UserRole[] }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user role
    return <Navigate to={`/${user.role}/dashboard`} />;
  }

  return <MainLayout>{children}</MainLayout>;
};

// Component to initialize default courses
const CourseInitializer: React.FC = () => {
  const { courses, addCourse } = useCourses();

  useEffect(() => {
    // Only add default courses if no courses exist
    if (courses.length === 0) {
      defaultCourses.forEach(course => {
        addCourse({
          ...course,
          status: 'active'
        });
      });
    }
  }, []);

  return null;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          user ? <Navigate to={`/${user.role}/dashboard`} /> : <Login />
        }
      />
      <Route
        path="/register"
        element={
          user ? <Navigate to={`/${user.role}/dashboard`} /> : <Register />
        }
      />
      
      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <UserManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/courses"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <CourseManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/pre-enrollments"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <PreEnrollmentManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/bookings"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <BookingManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/virtual-event"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <React.Suspense fallback={<div>Loading...</div>}>
              <VirtualEvent />
            </React.Suspense>
          </ProtectedRoute>
        }
      />

      {/* Student Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/courses"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <OfferedCourses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/enrollment"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <CourseEnrollment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/enrolled-courses"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <EnrolledCourses />
          </ProtectedRoute>
        }
      />

      {/* Visitor Routes */}
      <Route
        path="/visitor/dashboard"
        element={
          <ProtectedRoute allowedRoles={['visitor']}>
            <VisitorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/visitor/tour"
        element={
          <ProtectedRoute allowedRoles={['visitor']}>
            <VirtualTour />
          </ProtectedRoute>
        }
      />
      <Route
        path="/visitor/book"
        element={
          <ProtectedRoute allowedRoles={['visitor']}>
            <BookingSystem />
          </ProtectedRoute>
        }
      />
      <Route
        path="/visitor/my-bookings"
        element={
          <ProtectedRoute allowedRoles={['visitor']}>
            <MyBookings />
          </ProtectedRoute>
        }
      />

      {/* Common Routes */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={['admin', 'student', 'visitor']}>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Default Route */}
      <Route
        path="/"
        element={
          user ? (
            <Navigate to={`/${user.role}/dashboard`} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <UserProvider>
            <CourseProvider>
              <PreEnrollmentProvider>
                <BookingProvider>
                  <VirtualEventProvider>
                    <CourseInitializer />
                    <ThemeProvider theme={theme}>
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <AppRoutes />
                      </React.Suspense>
                    </ThemeProvider>
                  </VirtualEventProvider>
                </BookingProvider>
              </PreEnrollmentProvider>
            </CourseProvider>
          </UserProvider>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App; 