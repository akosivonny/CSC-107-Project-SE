import { UserRole } from '../types';

interface UserData {
  name: string;
  role: UserRole;
  password: string;
  phone?: string;
  address?: string;
}

/**
 * Utility function to clear all student data from the system
 */
export const clearAllStudentData = () => {
  try {
    // Clear user database except admin
    const mockUserDB = localStorage.getItem('mockUserDB');
    if (mockUserDB) {
      // Parse the JSON string into an array of entries
      const entries = JSON.parse(mockUserDB);
      
      // Convert the array back to a Map
      const users = new Map<string, UserData>(entries);
      
      // Filter out all users except admin and convert back to array
      const filteredEntries = Array.from(users.entries()).filter(([email, userData]) => 
        email === 'admin@farmmanagement.com' || userData.role !== 'student'
      );
      
      // Save the filtered entries back to localStorage
      localStorage.setItem('mockUserDB', JSON.stringify(filteredEntries));
    }

    // Clear all pre-enrollment records
    localStorage.removeItem('preEnrollments');

    // Clear current user session if it's a student
    const currentUser = localStorage.getItem('user');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      if (user.role === 'student') {
        localStorage.removeItem('user');
      }
    }

    return { success: true, message: 'All student data has been cleared successfully.' };
  } catch (error) {
    console.error('Error clearing student data:', error);
    return { 
      success: false, 
      message: 'Failed to clear student data. Please try again.' 
    };
  }
}; 