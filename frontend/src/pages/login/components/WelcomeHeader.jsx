import React from 'react';
import Icon from '../../../components/AppIcon';

const WelcomeHeader = ({ className = '' }) => {
  return (
    <div className={`text-center space-y-4 ${className}`}>
      {/* Logo */}
      <div className="flex items-center justify-center">
        <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-lg">
          <svg
            viewBox="0 0 24 24"
            className="w-8 h-8 text-primary-foreground"
            fill="currentColor"
          >
            <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
            <path d="M8 11l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
        </div>
      </div>

      {/* Welcome Text */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground font-heading">
          Welcome to VidyaLink
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Bridging the education gap with low-bandwidth optimized virtual classrooms for rural learning
        </p>
      </div>

      {/* Features Highlight */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon name="Wifi" size={16} className="text-success" />
          <span>Low Bandwidth</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon name="Download" size={16} className="text-primary" />
          <span>Offline Access</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon name="Users" size={16} className="text-secondary" />
          <span>Expert Teachers</span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;