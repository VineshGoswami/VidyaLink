import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConnectionStatusBanner = ({ connectionQuality, onModeChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentMode, setCurrentMode] = useState('auto');

  useEffect(() => {
    // Auto-collapse after 10 seconds if connection is good
    if (connectionQuality === 'good' && isExpanded) {
      const timer = setTimeout(() => setIsExpanded(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [connectionQuality, isExpanded]);

  const getStatusConfig = () => {
    switch (connectionQuality) {
      case 'offline':
        return {
          color: 'error',
          bgColor: 'bg-error/10',
          borderColor: 'border-error/20',
          icon: 'WifiOff',
          title: 'You are offline',
          message: 'Using cached content. Some features may be limited.',
          recommendations: [
            'Access downloaded lectures',
            'Review offline materials',
            'Complete saved quizzes'
          ]
        };
      case 'poor':
        return {
          color: 'error',
          bgColor: 'bg-error/10',
          borderColor: 'border-error/20',
          icon: 'Wifi',
          title: 'Poor connection detected',
          message: 'Limited connectivity may affect your learning experience.',
          recommendations: [
            'Switch to audio-only mode',
            'Download content for later',
            'Use text-based features'
          ]
        };
      case 'fair':
        return {
          color: 'warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20',
          icon: 'Wifi',
          title: 'Fair connection quality',
          message: 'Some features may load slowly. Consider optimizing your experience.',
          recommendations: [
            'Enable low-bandwidth mode',
            'Reduce video quality',
            'Close other apps'
          ]
        };
      case 'good':
        return {
          color: 'success',
          bgColor: 'bg-success/10',
          borderColor: 'border-success/20',
          icon: 'Wifi',
          title: 'Good connection',
          message: 'All features are available. Enjoy your learning experience!',
          recommendations: [
            'Join live sessions',
            'Stream HD content',
            'Use interactive features'
          ]
        };
      default:
        return {
          color: 'muted-foreground',
          bgColor: 'bg-muted',
          borderColor: 'border-border',
          icon: 'Wifi',
          title: 'Checking connection...',
          message: 'Please wait while we assess your connection quality.',
          recommendations: []
        };
    }
  };

  const statusConfig = getStatusConfig();

  const handleModeChange = (mode) => {
    setCurrentMode(mode);
    onModeChange?.(mode);
  };

  // Don't show banner for good connection unless expanded
  if (connectionQuality === 'good' && !isExpanded) {
    return null;
  }

  return (
    <div className={`${statusConfig?.bgColor} border ${statusConfig?.borderColor} rounded-lg mb-6 overflow-hidden`}>
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon 
              name={statusConfig?.icon} 
              size={20} 
              className={`text-${statusConfig?.color}`}
            />
            <div>
              <h3 className={`font-semibold text-${statusConfig?.color} text-sm`}>
                {statusConfig?.title}
              </h3>
              <p className="text-muted-foreground text-xs">
                {statusConfig?.message}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {connectionQuality !== 'offline' && connectionQuality !== 'good' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={(e) => {
                  e?.stopPropagation();
                  handleModeChange('audio-only');
                }}
              >
                Audio Only
              </Button>
            )}
            
            <Icon 
              name="ChevronDown" 
              size={16} 
              className={`text-muted-foreground transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </div>
        </div>
      </div>
      {isExpanded && (
        <div className="border-t border-border/50 p-4 space-y-4 animate-fade-in">
          {/* Recommendations */}
          {statusConfig?.recommendations?.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">
                Recommended Actions:
              </h4>
              <ul className="space-y-1">
                {statusConfig?.recommendations?.map((recommendation, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon name="Check" size={12} className={`text-${statusConfig?.color}`} />
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Mode Selection */}
          {connectionQuality !== 'offline' && (
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">
                Optimize Experience:
              </h4>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={currentMode === 'auto' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleModeChange('auto')}
                >
                  Auto Mode
                </Button>
                <Button
                  variant={currentMode === 'audio-only' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleModeChange('audio-only')}
                >
                  Audio Only
                </Button>
                <Button
                  variant={currentMode === 'low-bandwidth' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleModeChange('low-bandwidth')}
                >
                  Low Bandwidth
                </Button>
              </div>
            </div>
          )}

          {/* Connection Details */}
          <div className="text-xs text-muted-foreground pt-2 border-t border-border/50">
            Last checked: {new Date()?.toLocaleTimeString('en-IN')} • 
            <button 
              className={`ml-1 text-${statusConfig?.color} hover:underline`}
              onClick={() => window.location?.reload()}
            >
              Refresh connection
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionStatusBanner;