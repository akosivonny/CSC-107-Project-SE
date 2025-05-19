import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNotifications } from './NotificationContext';
import { format } from 'date-fns';
import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_SERVICE_ID = 'service_c9nmkwm';
const EMAILJS_TEMPLATE_ID = 'template_yaylpcx';
const EMAILJS_PUBLIC_KEY = '6jAZsNiNZ3fO9zTjS';

export interface Booking {
  id: string;
  visitorName: string;
  email: string;
  visitDate: string;
  groupSize: number;
  purpose: string;
  specialRequirements: string;
  status: 'pending' | 'approved' | 'rejected';
  adminFeedback?: string;
  createdAt: string;
}

interface BookingContextType {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'status' | 'createdAt'>) => Promise<void>;
  updateBookingStatus: (id: string, status: Booking['status'], feedback?: string) => Promise<void>;
  getVisitorBookings: (email: string) => Booking[];
  getAllBookings: () => Booking[];
  deleteBooking: (id: string) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const savedBookings = localStorage.getItem('bookings');
    return savedBookings ? JSON.parse(savedBookings) : [];
  });

  const { addNotification } = useNotifications();

  useEffect(() => {
    localStorage.setItem('bookings', JSON.stringify(bookings));
  }, [bookings]);

  const addBooking = async (newBooking: Omit<Booking, 'id' | 'status' | 'createdAt'>) => {
    const booking: Booking = {
      ...newBooking,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setBookings(prev => [...prev, booking]);

    // Add notification for admin
    addNotification({
      userId: 'admin',
      title: 'New Booking Request',
      message: `New visit booking from ${newBooking.visitorName} for ${format(new Date(newBooking.visitDate), 'PPP p')}`,
      type: 'info',
    });
  };

  const updateBookingStatus = async (
    id: string,
    status: Booking['status'],
    feedback?: string
  ) => {
    setBookings(prev =>
      prev.map(booking => {
        if (booking.id === id) {
          const statusChanged = booking.status !== status;
          const feedbackChanged = booking.adminFeedback !== feedback;
          
          // Add notification for visitor when their booking status or feedback changes
          if (statusChanged || feedbackChanged) {
            addNotification({
              userId: booking.email,
              title: statusChanged ? 'Booking Status Updated' : 'New Feedback Received',
              message: statusChanged 
                ? `Your booking for ${format(new Date(booking.visitDate), 'PPP p')} has been ${status}${feedback ? `: ${feedback}` : ''}`
                : `New feedback received for your booking: ${feedback}`,
              type: statusChanged 
                ? (status === 'approved' ? 'success' : status === 'rejected' ? 'error' : 'info')
                : 'info',
            });

            // Send email notification to visitor
            const emailParams = {
              to_email: booking.email,
              to_name: booking.visitorName.split(' ')[0],
              visitor_full_name: booking.visitorName,
              visit_date: format(new Date(booking.visitDate), 'PPP p'),
              booking_status: status,
              feedback: feedback || 'No additional feedback provided',
              purpose: booking.purpose,
              group_size: booking.groupSize,
              reply_to: booking.email,
              from_name: 'Eutiquio Integrated Farm'
            };

            try {
              emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                emailParams,
                EMAILJS_PUBLIC_KEY
              ).then(
                (result) => {
                  console.log('Email sent successfully:', result);
                  addNotification({
                    userId: 'admin',
                    title: 'Email Sent',
                    message: `Notification email sent to ${booking.visitorName} (${booking.email})`,
                    type: 'success',
                  });
                },
                (error) => {
                  console.error('Email sending failed:', error);
                  addNotification({
                    userId: 'admin',
                    title: 'Email Error',
                    message: `Failed to send email to ${booking.visitorName} (${booking.email}): ${error.text}`,
                    type: 'error',
                  });
                }
              );
            } catch (error) {
              console.error('Email sending failed:', error);
            }
          }

          return { ...booking, status, adminFeedback: feedback };
        }
        return booking;
      })
    );
  };

  const getVisitorBookings = (email: string) => {
    return bookings.filter(booking => booking.email === email);
  };

  const getAllBookings = () => bookings;

  const deleteBooking = (id: string) => {
    setBookings(prev => prev.filter(booking => booking.id !== id));
    
    // Add notification for admin
    addNotification({
      userId: 'admin',
      title: 'Booking Deleted',
      message: 'A booking has been deleted from the system',
      type: 'info',
    });
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        addBooking,
        updateBookingStatus,
        getVisitorBookings,
        getAllBookings,
        deleteBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}; 