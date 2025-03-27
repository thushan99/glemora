import React, { createContext, useState, useContext, useEffect } from 'react';
import {Navigate} from "react-router-dom";

// AuthContext to manage authentication state
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Simulated login function (replace with your actual authentication logic)
  const login = (email, password) => {
    // Simulated user roles
    const users = {
      'user@example.com': {
        role: 'user',
        name: 'John Doe',
        email: 'user@example.com'
      },
      'admin@example.com': {
        role: 'admin',
        name: 'Admin User',
        email: 'admin@example.com'
      }
    };

    const foundUser = users[email];
    if (foundUser) {
      // In a real app, you'd verify the password here
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Check for existing authentication on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
      <AuthContext.Provider value={{ user, login, logout }}>
        {children}
      </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Protected Route Component
export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useAuth();

  if (!user) {
    // Redirect to login if no user
    return <Navigate to="/login" replace />;
  }

  // If specific roles are required and user doesn't match
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to unauthorized page or dashboard
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};