import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCourses } from './CourseContext';
import { useNotifications } from './NotificationContext';
import emailjs from '@emailjs/browser';

// EmailJS configuration for enrollment notifications
const EMAILJS_SERVICE_ID = 'service_c9nmkwm';
const EMAILJS_ENROLLMENT_TEMPLATE_ID = 'template_4ihdvel';
const EMAILJS_PUBLIC_KEY = '6jAZsNiNZ3fO9zTjS';

interface PreEnrollment {
  id: string;
  studentId: string;
  courseId: string;
  status: 'pending' | 'approved' | 'rejected' | 'enrolled';
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  guardianName: string;
  guardianPhone: string;
  document?: {
    name: string;
    url: string;
    type: string;
  };
  createdAt: string;
  updatedAt: string;
  adminFeedback?: string;
}

interface PreEnrollmentFormData {
  studentId: string;
  courseId: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  guardianName: string;
  guardianPhone: string;
  document?: File;
}

interface PreEnrollmentContextType {
  requests: PreEnrollment[];
  submitPreEnrollment: (formData: PreEnrollmentFormData) => Promise<void>;
  getStudentEnrollmentStatus: (studentId: string, courseId: string) => 'pending' | 'approved' | 'rejected' | 'enrolled' | null;
  updateEnrollmentStatus: (requestId: string, status: PreEnrollment['status'], feedback?: string) => void;
  deleteEnrollment: (requestId: string) => void;
  unenrollStudent: (requestId: string) => void;
}

const PreEnrollmentContext = createContext<PreEnrollmentContextType | undefined>(undefined);

export const PreEnrollmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<PreEnrollment[]>(() => {
    const savedRequests = localStorage.getItem('preEnrollments');
    return savedRequests ? JSON.parse(savedRequests) : [];
  });

  const { updateEnrollmentCount, courses } = useCourses();
  const { addNotification } = useNotifications();

  useEffect(() => {
    localStorage.setItem('preEnrollments', JSON.stringify(requests));
  }, [requests]);

  const submitPreEnrollment = async (formData: PreEnrollmentFormData) => {
    // Check if there's already an enrollment request for this student and course
    const existingRequest = requests.find(
      req => req.studentId === formData.studentId && 
             req.courseId === formData.courseId
    );

    // Get course name for notifications
    const course = courses.find(c => c.id === formData.courseId);
    const courseName = course ? course.title : 'Unknown Course';

    if (existingRequest) {
      // If there's an existing request that's rejected, update it
      if (existingRequest.status === 'rejected') {
        setRequests(prev => prev.map(req => 
          req.id === existingRequest.id
            ? {
                ...req,
                status: 'pending',
                updatedAt: new Date().toISOString()
              }
            : req
        ));

        // Send notification to admin about the resubmission
        addNotification({
          userId: 'admin',
          title: 'Enrollment Request Resubmitted',
          message: `${formData.name} has resubmitted their enrollment request for ${courseName}.`,
          type: 'info'
        });
      }
      return;
    }

    // Handle document upload if present
    let documentData;
    if (formData.document) {
      // In a real application, you would upload to a server here
      // For now, we'll create a local URL
      documentData = {
        name: formData.document.name,
        url: URL.createObjectURL(formData.document),
        type: formData.document.type
      };
    }

    // Create new request if none exists
    const newRequest: PreEnrollment = {
      id: Date.now().toString(),
      studentId: formData.studentId,
      courseId: formData.courseId,
      status: 'pending',
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
      address: formData.address,
      guardianName: formData.guardianName,
      guardianPhone: formData.guardianPhone,
      document: documentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setRequests(prev => [...prev, newRequest]);

    // Send notification to admin about the new enrollment request
    addNotification({
      userId: 'admin',
      title: 'New Enrollment Request',
      message: `${formData.name} has submitted a new enrollment request for ${courseName}.`,
      type: 'info'
    });
  };

  const getStudentEnrollmentStatus = (studentId: string, courseId: string): 'pending' | 'approved' | 'rejected' | 'enrolled' | null => {
    // Find the most recent request for this student and course
    const studentRequests = requests.filter(
      req => req.studentId === studentId && req.courseId === courseId
    );

    if (studentRequests.length === 0) {
      return null;
    }

    // Sort by updatedAt to get the most recent request
    const mostRecentRequest = studentRequests.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )[0];

    return mostRecentRequest.status;
  };

  const updateEnrollmentStatus = (requestId: string, status: PreEnrollment['status'], feedback?: string) => {
    setRequests(prev => {
      const oldRequest = prev.find(req => req.id === requestId);
      const newRequests = prev.map(request => {
        if (request.id === requestId) {
          // Get course name for the email
          const course = courses.find(c => c.id === request.courseId);
          const courseName = course ? course.title : 'Unknown Course';

          // Get first name for greeting
          const firstName = request.name.split(' ')[0];

          // Send email notification to student
          const emailParams = {
            to_email: request.email,
            to_name: firstName, // Only use first name for greeting
            student_name: request.name, // Keep full name for enrollment details
            course: courseName,
            enrollment_status: status,
            student_type: 'Regular',
            admin_feedback: feedback || 'No additional feedback provided',
            reply_to: request.email,
            from_name: 'Eutiquio Integrated Farm'
          };

          try {
            emailjs.send(
              EMAILJS_SERVICE_ID,
              EMAILJS_ENROLLMENT_TEMPLATE_ID,
              emailParams,
              EMAILJS_PUBLIC_KEY
            ).then(
              (result) => {
                console.log('Enrollment status email sent successfully:', result);
                addNotification({
                  userId: 'admin',
                  title: 'Email Sent',
                  message: `Status update email sent to ${request.name} (${request.email})`,
                  type: 'success',
                });
              },
              (error) => {
                console.error('Failed to send enrollment status email:', error);
                addNotification({
                  userId: 'admin',
                  title: 'Email Error',
                  message: `Failed to send email to ${request.name} (${request.email}): ${error.text}`,
                  type: 'error',
                });
              }
            );
          } catch (error) {
            console.error('Failed to send enrollment status email:', error);
          }

          // Add notification in the system
          addNotification({
            userId: request.email,
            title: 'Enrollment Status Updated',
            message: `Your enrollment status has been updated to ${status}${feedback ? `: ${feedback}` : ''}`,
            type: status === 'approved' ? 'success' : status === 'rejected' ? 'error' : 'info',
          });

          return {
            ...request,
            status,
            adminFeedback: feedback,
            updatedAt: new Date().toISOString(),
          };
        }
        return request;
      });

      // Update course enrollment count if status changed to/from approved
      if (oldRequest) {
        if (oldRequest.status !== 'approved' && status === 'approved') {
          // Increment enrollment count when approving
          updateEnrollmentCount(oldRequest.courseId, true);
        } else if (oldRequest.status === 'approved' && status !== 'approved') {
          // Decrement enrollment count when un-approving
          updateEnrollmentCount(oldRequest.courseId, false);
        }
      }

      return newRequests;
    });
  };

  const deleteEnrollment = (requestId: string) => {
    const request = requests.find(req => req.id === requestId);
    if (request && request.status === 'approved') {
      // Decrement the enrollment count if the request was approved
      updateEnrollmentCount(request.courseId, false);
    }
    setRequests(prev => prev.filter(req => req.id !== requestId));
  };

  const unenrollStudent = (requestId: string) => {
    const request = requests.find(req => req.id === requestId);
    if (request && request.status === 'approved') {
      // Update the status to rejected and decrement the enrollment count
      updateEnrollmentStatus(requestId, 'rejected');
      updateEnrollmentCount(request.courseId, false);
    }
  };

  return (
    <PreEnrollmentContext.Provider
      value={{
        requests,
        submitPreEnrollment,
        getStudentEnrollmentStatus,
        updateEnrollmentStatus,
        deleteEnrollment,
        unenrollStudent,
      }}
    >
      {children}
    </PreEnrollmentContext.Provider>
  );
};

export const usePreEnrollment = () => {
  const context = useContext(PreEnrollmentContext);
  if (context === undefined) {
    throw new Error('usePreEnrollment must be used within a PreEnrollmentProvider');
  }
  return context;
}; 