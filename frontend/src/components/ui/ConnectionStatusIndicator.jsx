import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const ConnectionStatusIndicator = ({ className = '' }) => {
  const [connectionStatus, setConnectionStatus] = useState('good');
  const [isExpanded, setIsExpanded] = useState(false);
  const [bandwidth, setBandwidth] = useState(null);

  useEffect(() => {
    const checkConnection = () => {
      if (!navigator.onLine) {
        setConnectionStatus('offline');
        return;
      }

      // Simulate connection quality check
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (connection) {
        const effectiveType = connection?.effectiveType;
        switch (effectiveType) {
          case 'slow-2g': case'2g': setConnectionStatus('poor');
            break;
          case '3g': setConnectionStatus('fair');
            break;
          case '4g': setConnectionStatus('good');
            break;
          default:
            setConnectionStatus('good');
        }
        setBandwidth(connection?.downlink);
      }
    };

    checkConnection();
    
    const handleOnline = () => checkConnection();
    const handleOffline = () => setConnectionStatus('offline');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const interval = setInterval(checkConnection, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const getStatusConfig = () => {
    switch (connectionStatus) {
      case 'offline':
        return {
          color: 'text-error',
          bgColor: 'bg-error/10',
          icon: 'WifiOff',
          label: 'Offline',
          description: 'No internet connection. Using cached content.',
        };
      case 'poor':
        return {
          color: 'text-error',
          bgColor: 'bg-error/10',
          icon: 'Wifi',
          label: 'Poor',
          description: 'Limited connectivity. Some features may be unavailable.',
        };
      case 'fair':
        return {
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          icon: 'Wifi',
          label: 'Fair',
          description: 'Moderate connection. Video quality may be reduced.',
        };
      case 'good':
        return {
          color: 'text-success',
          bgColor: 'bg-success/10',
          icon: 'Wifi',
          label: 'Good',
          description: 'Strong connection. All features available.',
        };
      default:
        return {
          color: 'text-muted-foreground',
          bgColor: 'bg-muted',
          icon: 'Wifi',
          label: 'Unknown',
          description: 'Checking connection status...',
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-muted/50 ${statusConfig?.bgColor}`}
        aria-label={`Connection status: ${statusConfig?.label}`}
      >
        <Icon 
          name={statusConfig?.icon} 
          size={16} 
          className={`${statusConfig?.color} connection-indicator`}
        />
        <span className={`text-sm font-medium ${statusConfig?.color} hidden sm:inline`}>
          {statusConfig?.label}
        </span>
        <Icon 
          name="ChevronDown" 
          size={14} 
          className={`${statusConfig?.color} transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''} hidden md:inline`}
        />
      </button>
      {isExpanded && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-popover border border-border rounded-lg shadow-elevated z-50 animate-fade-in">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-full ${statusConfig?.bgColor}`}>
                <Icon 
                  name={statusConfig?.icon} 
                  size={20} 
                  className={statusConfig?.color}
                />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Connection Status
                </h3>
                <p className="text-sm text-muted-foreground">
                  {statusConfig?.description}
                </p>
              </div>
            </div>

            {bandwidth && (
              <div className="space-y-2 pt-3 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Bandwidth:</span>
                  <span className="font-mono text-foreground">
                    {bandwidth?.toFixed(1)} Mbps
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Quality:</span>
                  <span className={`font-medium ${statusConfig?.color}`}>
                    {statusConfig?.label}
                  </span>
                </div>
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-border">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Last checked: {new Date()?.toLocaleTimeString()}</span>
                <button
                  onClick={() => window.location?.reload()}
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionStatusIndicator;