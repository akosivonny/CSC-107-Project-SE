// User Types
export type UserRole = 'admin' | 'student' | 'visitor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  status: 'active' | 'inactive';
  joinDate: string;
  lastLogin: string;
}

// Course Types
export type CourseStatus = 'open' | 'full' | 'in-progress' | 'completed';

export interface Course {
  id: string;
  name: string;
  duration: number; // in weeks
  capacity: number; // max 30 students
  enrolledCount: number;
  description: string;
  startDate: string;
  status: CourseStatus;
  instructor: string;
  syllabus: string;
}

// Booking Types
export interface Booking {
  id: string;
  userId: string;
  date: string;
  time: string;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected';
}

// Event Types
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  registeredCount: number;
}

// Enrollment Types
export interface Enrollment {
  id: string;
  courseId: string;
  userId: string;
  enrollmentDate: string;
  status: 'active' | 'completed' | 'dropped';
  progress: number; // percentage of course completion
  lastAccessDate: string;
}

// Analytics Types
export interface DashboardAnalytics {
  totalUsers: number;
  activeStudents: number;
  totalCourses: number;
  upcomingEvents: number;
  recentBookings: number;
  pendingEnrollments: number;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
} 