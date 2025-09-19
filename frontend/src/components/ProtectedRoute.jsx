import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * ProtectedRoute component that redirects to login if user is not authenticated
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @param {Array<string>} [props.allowedRoles] - Optional roles that are allowed to access this route
 * @returns {React.ReactNode} - The protected component or redirect
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, getUserRole, loading } = useAuth();
  const location = useLocation();
  
  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-primary/20 mb-4"></div>
          <div className="h-4 w-48 bg-muted rounded"></div>
        </div>
      </div>
    );
  }
  
  // Check if user is authenticated
  if (!isAuthenticated()) {
    // Redirect to login page and save the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If roles are specified, check if user has the required role
  if (allowedRoles.length > 0) {
    const userRole = getUserRole();
    if (!allowedRoles.includes(userRole)) {
      // Redirect to appropriate dashboard based on role
      const dashboardRoutes = {
        student: '/student-dashboard',
        educator: '/educator-dashboard',
        admin: '/educator-dashboard'
      };
      return <Navigate to={dashboardRoutes[userRole] || '/'} replace />;
    }
  }
  
  // User is authenticated and has the required role, render the protected component
  return children;
};

export default ProtectedRoute;