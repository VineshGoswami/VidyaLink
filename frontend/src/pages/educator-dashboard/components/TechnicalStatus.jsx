import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const TechnicalStatus = () => {
  const [systemStatus, setSystemStatus] = useState({
    platform: 'operational',
    bandwidth: 'good',
    server: 'operational',
    recording: 'operational'
  });

  const [bandwidthSpeed, setBandwidthSpeed] = useState(45.2);

  useEffect(() => {
    // Simulate real-time status updates
    const interval = setInterval(() => {
      setBandwidthSpeed(prev => {
        const variation = (Math.random() - 0.5) * 10;
        return Math.max(10, Math.min(100, prev + variation));
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'operational':
        return { color: 'text-success', bg: 'bg-success/10', label: 'Operational', icon: 'CheckCircle' };
      case 'degraded':
        return { color: 'text-warning', bg: 'bg-warning/10', label: 'Degraded', icon: 'AlertTriangle' };
      case 'down':
        return { color: 'text-error', bg: 'bg-error/10', label: 'Down', icon: 'XCircle' };
      default:
        return { color: 'text-muted-foreground', bg: 'bg-muted', label: 'Unknown', icon: 'HelpCircle' };
    }
  };

  const getBandwidthStatus = (speed) => {
    if (speed >= 40) return { color: 'text-success', label: 'Excellent' };
    if (speed >= 25) return { color: 'text-warning', label: 'Good' };
    if (speed >= 10) return { color: 'text-error', label: 'Fair' };
    return { color: 'text-error', label: 'Poor' };
  };

  const statusItems = [
    { key: 'platform', label: 'Platform Status', status: systemStatus?.platform },
    { key: 'server', label: 'Server Health', status: systemStatus?.server },
    { key: 'recording', label: 'Recording Service', status: systemStatus?.recording }
  ];

  const bandwidthStatus = getBandwidthStatus(bandwidthSpeed);

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Icon name="Activity" size={20} />
        Technical Status
      </h3>
      <div className="space-y-4">
        {/* System Status Items */}
        {statusItems?.map((item) => {
          const config = getStatusConfig(item?.status);
          return (
            <div key={item?.key} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${config?.bg}`}>
                  <Icon name={config?.icon} size={16} className={config?.color} />
                </div>
                <span className="text-sm font-medium text-foreground">
                  {item?.label}
                </span>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${config?.color} ${config?.bg}`}>
                {config?.label}
              </div>
            </div>
          );
        })}

        {/* Bandwidth Status */}
        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Icon name="Wifi" size={16} className="text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Bandwidth</span>
            </div>
            <div className={`text-sm font-medium ${bandwidthStatus?.color}`}>
              {bandwidthStatus?.label}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    bandwidthSpeed >= 40 ? 'bg-success' :
                    bandwidthSpeed >= 25 ? 'bg-warning' : 'bg-error'
                  }`}
                  style={{ width: `${Math.min(bandwidthSpeed, 100)}%` }}
                />
              </div>
            </div>
            <span className="text-sm font-mono text-foreground">
              {bandwidthSpeed?.toFixed(1)} Mbps
            </span>
          </div>
        </div>

        {/* Last Updated */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
          <span>Last updated: {new Date()?.toLocaleTimeString()}</span>
          <button className="text-primary hover:text-primary/80 transition-colors">
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default TechnicalStatus;