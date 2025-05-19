import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    phone?: string;
    address?: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initialize mockUserDB from localStorage or create new if not exists
const initializeMockUserDB = () => {
  const savedUsers = localStorage.getItem('mockUserDB');
  if (savedUsers) {
    const parsed = JSON.parse(savedUsers) as [string, {
      name: string;
      role: UserRole;
      password: string;
      phone?: string;
      address?: string;
    }][];
    return new Map(parsed);
  }
  return new Map<string, { 
    name: string; 
    role: UserRole; 
    password: string;
    phone?: string;
    address?: string;
  }>();
};

// Mock user database for development
const mockUserDB = initializeMockUserDB();

// Hardcoded admin account
const ADMIN_EMAIL = 'admin@farmmanagement.com';
const ADMIN_PASSWORD = 'admin123';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('user');
  });

  // Save mockUserDB whenever it changes
  const saveMockUserDB = () => {
    const serializedDB = JSON.stringify(Array.from(mockUserDB.entries()));
    localStorage.setItem('mockUserDB', serializedDB);
    // For debugging
    console.log('Current users in DB:', Array.from(mockUserDB.entries()));
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      // Check if it's the admin account
      if (email === ADMIN_EMAIL) {
        if (password === ADMIN_PASSWORD) {
          const adminUser = {
            id: 'admin1',
            name: 'System Administrator',
            email: ADMIN_EMAIL,
            role: 'admin' as UserRole,
          };
          setUser(adminUser);
          setIsAuthenticated(true);
          return;
        }
        throw new Error('Invalid credentials');
      }

      // For debugging
      console.log('Attempting login with:', email);
      console.log('Available users:', Array.from(mockUserDB.entries()));

      // Check regular user accounts
      const userRecord = mockUserDB.get(email);
      if (!userRecord) {
        console.log('User not found in database');
        throw new Error('Invalid credentials');
      }

      if (userRecord.password !== password) {
        console.log('Password mismatch');
        throw new Error('Invalid credentials');
      }

      const mockUser = {
        id: Date.now().toString(),
        name: userRecord.name,
        email: email,
        role: userRecord.role,
      };

      setUser(mockUser);
      setIsAuthenticated(true);
      console.log('Login successful for:', email);
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed');
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    phone?: string;
    address?: string;
  }) => {
    try {
      // Prevent registration with admin email
      if (userData.email === ADMIN_EMAIL) {
        throw new Error('This email is reserved for system use');
      }

      // Prevent registration with admin role
      if (userData.role === 'admin') {
        throw new Error('Admin accounts cannot be created through registration');
      }

      // Check if email is already registered
      if (mockUserDB.has(userData.email)) {
        throw new Error('Email is already registered');
      }

      // Store user data in mock database
      mockUserDB.set(userData.email, {
        name: userData.name,
        role: userData.role,
        password: userData.password,
        phone: userData.phone,
        address: userData.address,
      });

      // Save updated mockUserDB to localStorage immediately
      saveMockUserDB();

      // For debugging
      console.log('User registered successfully:', userData.email);
      console.log('Current users in DB:', Array.from(mockUserDB.entries()));

      return;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 