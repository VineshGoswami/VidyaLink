import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const ConnectionStatus = ({ className = '' }) => {
  const [connectionQuality, setConnectionQuality] = useState('good');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [bandwidth, setBandwidth] = useState(null);

  useEffect(() => {
    const checkConnection = () => {
      setIsOnline(navigator.onLine);
      
      if (!navigator.onLine) {
        setConnectionQuality('offline');
        return;
      }

      // Simulate bandwidth detection
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (connection) {
        const effectiveType = connection?.effectiveType;
        setBandwidth(connection?.downlink);
        
        switch (effectiveType) {
          case 'slow-2g': case'2g': setConnectionQuality('poor');
            break;
          case '3g': setConnectionQuality('fair');
            break;
          case '4g': setConnectionQuality('good');
            break;
          default:
            setConnectionQuality('good');
        }
      } else {
        // Fallback for browsers without connection API
        setConnectionQuality('good');
        setBandwidth(5.2);
      }
    };

    checkConnection();

    const handleOnline = () => checkConnection();
    const handleOffline = () => {
      setIsOnline(false);
      setConnectionQuality('offline');
    };

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
    switch (connectionQuality) {
      case 'offline':
        return {
          color: 'text-error',
          bgColor: 'bg-error/10',
          borderColor: 'border-error/20',
          icon: 'WifiOff',
          label: 'Offline',
          message: 'No internet connection. Limited functionality available.',
          showBandwidth: false
        };
      case 'poor':
        return {
          color: 'text-error',
          bgColor: 'bg-error/10',
          borderColor: 'border-error/20',
          icon: 'Wifi',
          label: 'Poor Connection',
          message: 'Limited bandwidth detected. Audio-only mode recommended.',
          showBandwidth: true
        };
      case 'fair':
        return {
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20',
          icon: 'Wifi',
          label: 'Fair Connection',
          message: 'Moderate bandwidth. Video quality may be reduced.',
          showBandwidth: true
        };
      case 'good':
        return {
          color: 'text-success',
          bgColor: 'bg-success/10',
          borderColor: 'border-success/20',
          icon: 'Wifi',
          label: 'Good Connection',
          message: 'Strong connection. All features available.',
          showBandwidth: true
        };
      default:
        return {
          color: 'text-muted-foreground',
          bgColor: 'bg-muted',
          borderColor: 'border-border',
          icon: 'Wifi',
          label: 'Checking...',
          message: 'Detecting connection quality...',
          showBandwidth: false
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className={`p-4 border rounded-lg ${statusConfig?.bgColor} ${statusConfig?.borderColor} ${className}`}>
      <div className="flex items-center gap-3 mb-2">
        <Icon 
          name={statusConfig?.icon} 
          size={20} 
          className={statusConfig?.color}
        />
        <div className="flex-1">
          <h3 className={`text-sm font-medium ${statusConfig?.color}`}>
            {statusConfig?.label}
          </h3>
          {statusConfig?.showBandwidth && bandwidth && (
            <p className="text-xs text-muted-foreground font-mono">
              {bandwidth?.toFixed(1)} Mbps
            </p>
          )}
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        {statusConfig?.message}
      </p>
      {connectionQuality === 'offline' && (
        <div className="mt-3 pt-3 border-t border-error/20">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Icon name="Download" size={14} />
            <span>Cached content available for offline access</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus;