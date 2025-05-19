export type UserRole = 'admin' | 'student' | 'visitor';
export type UserStatus = 'active' | 'inactive';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joinDate: string;
  lastLogin: string;
  phone?: string;
  address?: string;
}

export type CourseStatus = 'active' | 'inactive' | 'full';

export interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
  department?: string;
  instructor: string;
  status: 'active' | 'inactive';
  duration: number;  // in weeks
  schedule: string;
  enrollmentLimit: number;
  currentEnrollment: number;
  fee: number;
  startDate: string;
  units?: number;
  syllabus?: string;
  createdAt: string;
  updatedAt: string;
}

export type EnrollmentStatus = 'pending' | 'approved' | 'rejected';

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  status: EnrollmentStatus;
  enrollmentDate: string;
  completionDate?: string;
}

export interface PreEnrollmentRequest {
  id: string;
  studentName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  guardianName: string;
  guardianPhone: string;
  course: string;
  status: EnrollmentStatus;
  submissionDate: string;
  document: string | File;
  rejectionReason?: string;
}

export interface PreEnrollment {
  id: string;
  studentId: string;
  courseId: string;
  status: 'pending' | 'approved' | 'rejected';
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
} 