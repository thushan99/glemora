import React, { createContext, useState, useContext, useEffect } from 'react';
import { Navigate } from "react-router-dom";
import axios from 'axios';

// Create an axios instance with interceptors
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'X-Api-Version': 'v1'
  }
});

// AuthContext to manage authentication state
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sync cart with backend after login
  const syncCartWithBackend = async () => {
    try {
      const localCart = JSON.parse(localStorage.getItem('cart')) || [];

      if (localCart.length === 0) return;

      // For each item in local cart, add to backend cart
      for (const item of localCart) {
        await api.post('/cart', null, {
          params: {
            productId: item.productId,
            quantity: item.quantity,
            size: item.size
          }
        });
      }

      // Clear localStorage cart after successful sync
      localStorage.removeItem('cart');
    } catch (err) {
      console.error('Error syncing cart with backend:', err);
    }
  };

  // Login function using backend authentication
  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/sign-in', { username, password });

      // Store authentication details
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', username);

      // Extract user role
      const userRole = response.data.userType[0].name.toLowerCase();
      localStorage.setItem('userRole', userRole);

      // Set user state
      setUser({
        username: username,
        role: userRole,
        token: response.data.token
      });
      setIsAuthenticated(true);

      // Sync localStorage cart with backend after login
      await syncCartWithBackend();

      return true;
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data : error);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');

    // Reset user state
    setUser(null);
    setIsAuthenticated(false);
  };

  // Check for existing authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const userRole = localStorage.getItem('userRole');

    // Add request interceptor to include token in headers
    const interceptor = api.interceptors.request.use(
        (config) => {
          if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
          }
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
    );

    if (token && username && userRole) {
      setUser({
        username,
        role: userRole,
        token
      });
      setIsAuthenticated(true);
    }

    setLoading(false);

    // Cleanup interceptor
    return () => {
      api.interceptors.request.eject(interceptor);
    };
  }, []);

  // If still loading, you might want to show a loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
      <AuthContext.Provider value={{
        user,
        login,
        logout,
        isAuthenticated,
        api  // Expose the configured axios instance
      }}>
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
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  // If specific roles are required and user doesn't match
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default api;  // Export the axios instance for use in other components
