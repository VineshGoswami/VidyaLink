import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const SignupForm = ({ onSubmit, isLoading, error }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    agreeToTerms: false
  });
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    
    if (!formData?.name) {
      errors.name = 'Name is required';
    }
    
    if (!formData?.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData?.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData?.password) {
      errors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData?.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData?.password !== formData?.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData?.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors?.[field]) {
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
      {/* Name Input */}
      <Input
        label="Full Name"
        type="text"
        placeholder="Enter your full name"
        value={formData?.name}
        onChange={(e) => handleInputChange('name', e?.target?.value)}
        error={validationErrors?.name}
        required
        disabled={isLoading}
      />
      {/* Email Input */}
      <Input
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        value={formData?.email}
        onChange={(e) => handleInputChange('email', e?.target?.value)}
        error={validationErrors?.email}
        required
        disabled={isLoading}
      />
      {/* Password Input */}
      <Input
        label="Password"
        type="password"
        placeholder="Create a password"
        value={formData?.password}
        onChange={(e) => handleInputChange('password', e?.target?.value)}
        error={validationErrors?.password}
        required
        disabled={isLoading}
      />
      {/* Confirm Password Input */}
      <Input
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        value={formData?.confirmPassword}
        onChange={(e) => handleInputChange('confirmPassword', e?.target?.value)}
        error={validationErrors?.confirmPassword}
        required
        disabled={isLoading}
      />
      {/* Role Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">
          Select Your Role
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {roleOptions?.map((role) => (
            <label
              key={role?.value}
              className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                formData?.role === role?.value
                  ? 'border-primary bg-primary/5 text-primary' :'border-border hover:border-primary/50 hover:bg-muted/50'
              }`}
            >
              <input
                type="radio"
                name="role"
                value={role?.value}
                checked={formData?.role === role?.value}
                onChange={(e) => handleInputChange('role', e?.target?.value)}
                className="sr-only"
                disabled={isLoading}
              />
              <Icon 
                name={role?.icon} 
                size={18} 
                className={formData?.role === role?.value ? 'text-primary' : 'text-muted-foreground'}
              />
              <span className="text-sm font-medium">{role?.label}</span>
            </label>
          ))}
        </div>
      </div>
      {/* Terms and Conditions Checkbox */}
      <div className="flex items-start gap-2">
        <Checkbox
          label={<span>I agree to the <a href="#" className="text-primary hover:underline">Terms and Conditions</a></span>}
          checked={formData?.agreeToTerms}
          onChange={(e) => handleInputChange('agreeToTerms', e?.target?.checked)}
          disabled={isLoading}
          error={validationErrors?.agreeToTerms}
        />
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
        iconName="UserPlus"
        iconPosition="right"
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  );
};

export default SignupForm;