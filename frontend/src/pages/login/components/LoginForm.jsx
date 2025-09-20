import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const LoginForm = ({ onSubmit, isLoading, error }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
    role: 'student'
  });
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const roleOptions = [
    { value: 'student', label: 'Student', icon: 'GraduationCap' },
    { value: 'educator', label: 'Educator', icon: 'Users' },
    { value: 'admin', label: 'Administrator', icon: 'Shield' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Input */}
      <Input
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={(e) => handleInputChange('email', e.target.value)}
        error={validationErrors.email}
        required
        disabled={isLoading}
      />
      {/* Password Input */}
      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={(e) => handleInputChange('password', e.target.value)}
        error={validationErrors.password}
        required
        disabled={isLoading}
      />
      {/* Role Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">
          Select Your Role
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {roleOptions.map((role) => (
            <label
              key={role.value}
              className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                formData.role === role.value
                  ? 'border-primary bg-primary/5 text-primary' :'border-border hover:border-primary/50 hover:bg-muted/50'
              }`}
            >
              <input
                type="radio"
                name="role"
                value={role.value}
                checked={formData.role === role.value}
                onChange={(e) => handleInputChange('role', e.target.value)}
                className="sr-only"
                disabled={isLoading}
              />
              <Icon 
                name={role.icon} 
                size={18} 
                className={formData.role === role.value ? 'text-primary' : 'text-muted-foreground'}
              />
              <span className="text-sm font-medium">{role.label}</span>
            </label>
          ))}
        </div>
      </div>
      {/* Remember Me Checkbox */}
      <div className="flex items-center justify-between">
        <Checkbox
          label="Remember me"
          checked={formData.rememberMe}
          onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
          disabled={isLoading}
        />
        <button
          type="button"
          className="text-sm text-primary hover:text-primary/80 transition-colors"
          disabled={isLoading}
        >
          Forgot password?
        </button>
      </div>
      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-error/10 border border-error/20 rounded-lg">
          <Icon name="AlertCircle" size={16} className="text-error flex-shrink-0" />
          <p className="text-sm text-error">{error}</p>
        </div>
      )}
      {/* Submit Button */}
      <Button
        type="submit"
        variant="default"
        size="lg"
        fullWidth
        loading={isLoading}
        disabled={isLoading}
        iconName="LogIn"
        iconPosition="right"
      >
        {isLoading ? 'Signing In...' : 'Sign In'}
      </Button>
    </form>
  );
};

export default LoginForm;