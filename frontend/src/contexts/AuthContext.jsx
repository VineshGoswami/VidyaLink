import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

// Create the auth context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const navigate = useNavigate();

  // Import socket utilities
  const initializeSocket = async (userData) => {
    if (!userData || !userData.id) {
      console.error('Cannot initialize socket: Invalid user data');
      return;
    }
    
    try {
      // Import socket module
      const socketModule = await import('../utils/socketService').catch(err => {
        console.error('Socket module import error:', err);
        throw new Error('Failed to load socket module');
      });
      
      // Connect to socket with user data
      const socket = await socketModule.connectSocket(userData.id).catch(err => {
        console.error('Socket connection error:', err);
        throw new Error('Failed to connect to socket');
      });
      
      if (socket) {
        socket.auth = { 
          userId: userData.id, 
          userName: userData.name || 'User', 
          userRole: userData.role || 'student' 
        };
        setSocketConnected(true);
        console.log('Socket connected with user data:', userData.name);
        
        // Setup reconnection handler
        socket.on('reconnect', () => {
          console.log('Socket reconnected');
          setSocketConnected(true);
        });
        
        socket.on('disconnect', () => {
          console.log('Socket disconnected');
          setSocketConnected(false);
        });
      } else {
        console.warn('Socket connection returned null');
      }
    } catch (err) {
      console.error('Socket initialization error:', err);
      // Don't throw error to prevent login/registration failure
      // Just log the error and continue
    }
  };

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        // Check if we have auth data in localStorage
        const authData = localStorage.getItem('vidyalink_auth');
        if (!authData) {
          setLoading(false);
          return;
        }

        // Parse the auth data
        const { token: authToken, user: storedUser } = JSON.parse(authData);
        if (!authToken) {
          setLoading(false);
          return;
        }
        
        // Store token in state and api headers for all future requests
        setToken(authToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

        // Verify token with backend
        try {
          const response = await api.get('/auth/me');
          if (response.data?.success) {
            // Get user data from localStorage for role information
            const userData = localStorage.getItem('vidyalink_user');
            const parsedUserData = userData ? JSON.parse(userData) : {};
            
            // Combine backend user data with stored role
            const currentUser = {
              ...response.data.user,
              role: parsedUserData.role || 'student'
            };
            
            setUser(currentUser);
            
            // Initialize socket with user data
            await initializeSocket(currentUser);
          } else {
            // Token invalid, clear storage
            localStorage.removeItem('vidyalink_auth');
            localStorage.removeItem('vidyalink_user');
            if (!localStorage.getItem('vidyalink_remember')) {
              localStorage.removeItem('vidyalink_remember');
            }
          }
        } catch (err) {
          // API error, but we still have local data
          // Use the stored user data as fallback
          const currentUser = {
            ...storedUser,
            role: JSON.parse(localStorage.getItem('vidyalink_user') || '{}').role || 'student'
          };
          
          setUser(currentUser);
          
          // Initialize socket with user data even in offline mode
          await initializeSocket(currentUser);
        }
      } catch (err) {
        setError('Authentication error');
        console.error('Auth check error:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
    
    // Cleanup socket on unmount
    return () => {
      const cleanup = async () => {
        try {
          import('../utils/socketService')
            .then(socketModule => {
              socketModule.disconnectSocket();
              setSocketConnected(false);
            })
            .catch(err => {
              console.error('Socket module import error during cleanup:', err);
            });
        } catch (err) {
          console.error('Socket cleanup error:', err);
        }
      };
      cleanup();
    };
  }, []);

  // Login function
  const login = async (formData) => {
    try {
      setLoading(true);
      setError(null);

      const { email, password, role, rememberMe } = formData;

      // Validate input data
      if (!email || !password || !role) {
        const missingFields = [];
        if (!email) missingFields.push('email');
        if (!password) missingFields.push('password');
        if (!role) missingFields.push('role');
        
        const errorMsg = `Missing required fields: ${missingFields.join(', ')}`;
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        const errorMsg = 'Please enter a valid email address';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      // Make API request with error handling
      let resp;
      try {
        resp = await api.post('/auth/login', { email, password, role });
      } catch (apiError) {
        console.error('Login API error:', apiError);
        const serverMsg = apiError?.response?.data?.message || apiError?.response?.data?.msg;
        const errorMsg = serverMsg || 'Invalid credentials or server error. Please try again.';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      const { token, user: userData } = resp?.data || {};

      if (!token || !userData) {
        const errorMsg = 'Invalid server response. Missing authentication data.';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      try {
        // Store token in state and set in API headers
        setToken(token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Store auth data
        localStorage.setItem('vidyalink_auth', JSON.stringify({ token, user: userData }));

        // Store user data with role
        const userDataWithRole = {
          role,
          name: userData?.name || 'User',
          email: userData?.email,
          id: userData?.id,
          loginTime: new Date()?.toISOString(),
          rememberMe
        };
        localStorage.setItem('vidyalink_user', JSON.stringify(userDataWithRole));
        
        // Remember me preference
        if (rememberMe) {
          localStorage.setItem('vidyalink_remember', 'true');
        }

        // Set user in state with complete data
        const currentUser = { ...userData, role };
        setUser(currentUser);
        
        // Initialize socket connection with user data
        try {
          await initializeSocket(currentUser);
        } catch (socketError) {
          console.error('Socket connection error during login:', socketError);
          // Continue with login even if socket fails
        }

        // Navigate to appropriate dashboard
        const dashboardRoutes = {
          student: '/student-dashboard',
          educator: '/educator-dashboard',
          admin: '/educator-dashboard'
        };
        navigate(dashboardRoutes?.[role] || '/');

        return { success: true };
      } catch (storageError) {
        console.error('Error storing auth data:', storageError);
        setError('Login successful but error setting up session. Please try again.');
        return { success: false, error: 'Session setup error' };
      }
    } catch (err) {
      console.error('Login error:', err);
      const serverMsg = err?.response?.data?.message || err?.response?.data?.msg;
      const errorMessage = serverMsg || err?.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Disconnect socket
      const socketModule = await import('../utils/socketService');
      socketModule.disconnectSocket();
      setSocketConnected(false);
      
      // Clear local storage
      localStorage.removeItem('vidyalink_auth');
      localStorage.removeItem('vidyalink_user');
      if (!localStorage.getItem('vidyalink_remember')) {
        localStorage.removeItem('vidyalink_remember');
      }
      
      // Clear user and token state
      setUser(null);
      setToken(null);
      
      // Clear API headers
      delete api.defaults.headers.common['Authorization'];
      
      // Navigate to login
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      // Fallback logout even if socket disconnect fails
      localStorage.removeItem('vidyalink_auth');
      localStorage.removeItem('vidyalink_user');
      setUser(null);
      setToken(null);
      delete api.defaults.headers.common['Authorization'];
      navigate('/login');
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user;
  };

  // Get user role
  const getUserRole = () => {
    return user?.role || 'student';
  };

  // Register function
  const register = async (formData) => {
    try {
      setLoading(true);
      setError(null);

      const { name, email, password, role } = formData;

      // Validate input data
      if (!name || !email || !password || !role) {
        const missingFields = [];
        if (!name) missingFields.push('name');
        if (!email) missingFields.push('email');
        if (!password) missingFields.push('password');
        if (!role) missingFields.push('role');
        
        const errorMsg = `Missing required fields: ${missingFields.join(', ')}`;
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        const errorMsg = 'Please enter a valid email address';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      // Make API request with error handling
      let resp;
      try {
        resp = await api.post('/auth/register', { name, email, password, role });
      } catch (apiError) {
        console.error('Registration API error:', apiError);
        const serverMsg = apiError?.response?.data?.message || apiError?.response?.data?.msg;
        const errorMsg = serverMsg || 'Server error during registration. Please try again.';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
      
      if (resp?.data?.success) {
        // Auto-login after successful registration
        const { token, user: userData } = resp?.data || {};
        
        if (token && userData) {
          try {
            // Store token in state and set in API headers
            setToken(token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // Store auth data
            localStorage.setItem('vidyant_auth', JSON.stringify({ token, user: userData }));
            
            // Store user data with role
            const userDataWithRole = {
              role,
              name: userData?.name || 'User',
              email: userData?.email,
              id: userData?.id,
              loginTime: new Date()?.toISOString()
            };
            localStorage.setItem('vidyant_user', JSON.stringify(userDataWithRole));
            
            // Set user in state
            const currentUser = { ...userData, role };
            setUser(currentUser);
            
            // Initialize socket connection
            await initializeSocket(currentUser);
            
            // Navigate to appropriate dashboard
            const dashboardRoutes = {
              student: '/student-dashboard',
              educator: '/educator-dashboard',
              admin: '/educator-dashboard'
            };
            navigate(dashboardRoutes?.[role] || '/');
            
            return { success: true };
          } catch (storageError) {
            console.error('Error storing auth data:', storageError);
            setError('Registration successful but error setting up session. Please try logging in.');
            return { success: true, warning: 'Please login manually' };
          }
        } else {
          setError('Registration successful but login data incomplete. Please try logging in.');
          return { success: true, warning: 'Please login manually' };
        }
      } else {
        const errorMsg = resp?.data?.message || 'Registration failed with unknown error';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      console.error('Registration error:', err);
      const serverMsg = err?.response?.data?.message || err?.response?.data?.msg;
      const errorMessage = serverMsg || err?.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    token,
    loading,
    error,
    socketConnected,
    login,
    logout,
    register,
    isAuthenticated,
    getUserRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;