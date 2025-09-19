import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SignupForm from './components/SignupForm';
import { api } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';

const Signup = () => {
  const { login, loading: authLoading, error: authError } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [signupSuccess, setSignupSuccess] = useState(false);

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

  const handleSignup = async (formData) => {
    try {
      setLoading(true);
      setError(null);

      // Remove confirmPassword and agreeToTerms from the data sent to the API
      const { confirmPassword, agreeToTerms, ...signupData } = formData;

      // Call the register API endpoint
      const response = await api.post('/auth/register', signupData);

      if (response.data.success) {
        setSignupSuccess(true);
        
        // Auto login after successful signup
        await login({
          email: formData.email,
          password: formData.password,
          role: formData.role,
          rememberMe: false
        });
      } else {
        setError(response.data.message || 'Signup failed');
      }
    } catch (err) {
      const serverMsg = err?.response?.data?.message || err?.response?.data?.msg;
      const errorMessage = serverMsg || err?.message || 'Signup failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Create Your Account</h1>
            <p className="text-muted-foreground">Join VidyaLink and start your learning journey</p>
          </div>

          {/* Signup Form */}
          <div className="bg-card border border-border rounded-lg shadow-card p-6 mb-6">
            {signupSuccess ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 text-success mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">Account Created Successfully!</h2>
                <p className="text-muted-foreground mb-4">You are now being redirected to your dashboard.</p>
              </div>
            ) : (
              <SignupForm
                onSubmit={handleSignup}
                isLoading={loading || authLoading}
                error={error || authError}
              />
            )}
          </div>

          {/* Already have an account */}
          <div className="text-center">
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          {/* Footer Information */}
          <div className="text-center mt-8">
            <div className="text-xs text-muted-foreground">
              <p>Optimized for low-bandwidth connections</p>
              <p>© {new Date().getFullYear()} Vidyant. Bridging education gaps.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;