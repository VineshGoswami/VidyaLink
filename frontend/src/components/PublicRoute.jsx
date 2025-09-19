import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * PublicRoute component that redirects to dashboard if user is already authenticated
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if not authenticated
 * @returns {React.ReactNode} - The public component or redirect to dashboard
 */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, getUserRole, loading } = useAuth();
  
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
  
  // If user is already authenticated, redirect to appropriate dashboard
  if (isAuthenticated()) {
    const userRole = getUserRole();
    const dashboardRoutes = {
      student: '/student-dashboard',
      educator: '/educator-dashboard',
      admin: '/educator-dashboard'
    };
    return <Navigate to={dashboardRoutes[userRole] || '/'} replace />;
  }
  
  // User is not authenticated, render the public component
  return children;
};

export default PublicRoute;