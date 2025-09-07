import React from 'react';
import { Navigate } from 'react-router-dom';
import AdminDashboard from './pages/admin/Dashboard';
import BookingManagement from './pages/admin/BookingManagement';
import VirtualTour from './pages/visitor/VirtualTour';
import BookingSystem from './pages/visitor/BookingSystem';
import MyBookings from './pages/visitor/MyBookings';
import VirtualEvent from './pages/admin/VirtualEvent';

interface Route {
  path: string;
  element: React.ReactNode;
  children?: Route[];
}

export const adminRoutes: Route[] = [
  {
    path: '/admin',
    element: <AdminDashboard />,
  },
  {
    path: '/admin/bookings',
    element: <BookingManagement />,
  },
  {
    path: '/admin/virtual-event',
    element: <VirtualEvent />,
  },
];

export const visitorRoutes: Route[] = [
  {
    path: '/visitor/tour',
    element: <VirtualTour />,
  },
  {
    path: '/visitor/book',
    element: <BookingSystem />,
  },
  {
    path: '/visitor/my-bookings',
    element: <MyBookings />,
  },
];

// Redirect routes
export const redirectRoutes: Route[] = [
  {
    path: '/admin',
    element: <Navigate to="/admin/dashboard" replace />,
  },
  {
    path: '/visitor',
    element: <Navigate to="/visitor/tour" replace />,
  },
];

export const routes: Route[] = [
  ...adminRoutes,
  ...visitorRoutes,
  ...redirectRoutes,
]; 