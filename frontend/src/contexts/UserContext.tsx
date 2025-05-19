import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { useNotifications } from './NotificationContext';

interface UserContextType {
  users: User[];
  addUser: (user: Omit<User, 'id' | 'status' | 'joinDate' | 'lastLogin'>) => User;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  getUser: (id: string) => User | undefined;
  getUsersByRole: (role: UserRole) => User[];
  getRecentUsers: (days: number) => User[];
  getTotalUsers: () => number;
  refreshUsers: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('users');
    return savedUsers ? JSON.parse(savedUsers) : [];
  });

  const { addNotification } = useNotifications();

  // Function to refresh users from localStorage
  const refreshUsers = () => {
    // Get users from mockUserDB
    const mockUserDB = localStorage.getItem('mockUserDB');
    if (mockUserDB) {
      try {
        const entries = JSON.parse(mockUserDB);
        const userMap = new Map<string, any>(entries);
        
        // Convert mockUserDB entries to User array
        const userArray = Array.from(userMap.entries()).map(([email, userData]) => ({
          id: email, // Use email as ID for consistency
          email,
          name: userData.name,
          role: userData.role,
          status: 'active',
          joinDate: userData.joinDate || new Date().toISOString(),
          lastLogin: userData.lastLogin || new Date().toISOString(),
          phone: userData.phone,
          address: userData.address,
        }));

        setUsers(userArray);
      } catch (error) {
        console.error('Error parsing mockUserDB:', error);
      }
    }
  };

  // Listen for storage events to handle real-time updates across tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'mockUserDB' && event.newValue) {
        refreshUsers();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Persist users to localStorage and trigger real-time updates
  const persistUsers = (updatedUsers: User[]) => {
    // Convert User array to mockUserDB format
    const userMap = new Map();
    updatedUsers.forEach(user => {
      userMap.set(user.email, {
        name: user.name,
        role: user.role,
        password: 'preserved', // Preserve existing password
        phone: user.phone,
        address: user.address,
        joinDate: user.joinDate,
        lastLogin: user.lastLogin,
      });
    });

    // Get existing mockUserDB to preserve passwords
    const existingDB = localStorage.getItem('mockUserDB');
    if (existingDB) {
      const existing = new Map(JSON.parse(existingDB));
      // Preserve passwords from existing entries
      userMap.forEach((value, key) => {
        if (existing.has(key)) {
          value.password = existing.get(key).password;
        }
      });
    }

    localStorage.setItem('mockUserDB', JSON.stringify(Array.from(userMap.entries())));
    setUsers(updatedUsers);
  };

  const addUser = (userData: Omit<User, 'id' | 'status' | 'joinDate' | 'lastLogin'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0],
      lastLogin: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    persistUsers(updatedUsers);

    // Create notification for admin
    addNotification({
      userId: 'admin',
      title: 'New User Registration',
      message: `New ${userData.role} registered: ${userData.name} (${userData.email})`,
      type: 'info',
    });

    return newUser;
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    const updatedUsers = users.map(user =>
      user.id === id
        ? { ...user, ...updates }
        : user
    );
    persistUsers(updatedUsers);
  };

  const deleteUser = (id: string) => {
    const updatedUsers = users.filter(user => user.id !== id);
    persistUsers(updatedUsers);
  };

  const getUser = (id: string) => {
    return users.find(user => user.id === id);
  };

  const getUsersByRole = (role: UserRole) => {
    return users.filter(user => user.role === role);
  };

  const getRecentUsers = (days: number) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return users.filter(user => new Date(user.joinDate) >= cutoffDate);
  };

  const getTotalUsers = () => {
    return users.length;
  };

  // Auto-refresh users periodically
  useEffect(() => {
    const interval = setInterval(refreshUsers, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <UserContext.Provider value={{
      users,
      addUser,
      updateUser,
      deleteUser,
      getUser,
      getUsersByRole,
      getRecentUsers,
      getTotalUsers,
      refreshUsers,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
}; 