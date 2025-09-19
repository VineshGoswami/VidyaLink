import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import WelcomeHeader from './components/WelcomeHeader';
import LoginForm from './components/LoginForm';
import ConnectionStatus from './components/ConnectionStatus';
import OfflineCapabilities from './components/OfflineCapabilities';
import { api } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // No mock credentials - using real authentication

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleLogin = async (formData) => {
    // Use the login function from AuthContext
    await login(formData);
    
    // Navigation is handled inside the login function
    // No need to manually navigate or set errors here
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Welcome Header */}
          <WelcomeHeader className="mb-8" />

          {/* Connection Status */}
          <ConnectionStatus className="mb-6" />

          {/* Login Form */}
          <div className="bg-card border border-border rounded-lg shadow-card p-6 mb-6">
            <LoginForm
              onSubmit={handleLogin}
              isLoading={loading}
              error={error}
            />
          </div>

          {/* Offline Capabilities */}
          <OfflineCapabilities 
            isVisible={isOffline}
            className="mb-6"
          />

          {/* Don't have an account */}
          <div className="text-center mb-6">
            <p className="text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          {/* Footer Information */}
          <div className="text-center space-y-4">
            <div className="text-xs text-muted-foreground">
              <p>Optimized for low-bandwidth connections</p>
              <p>© {new Date()?.getFullYear()} VidyaLink. Bridging education gaps.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;