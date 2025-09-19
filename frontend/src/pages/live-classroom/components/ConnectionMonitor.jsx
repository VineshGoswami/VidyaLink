import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const ConnectionMonitor = ({ 
  onConnectionChange = () => {},
  onQualityChange = () => {} 
}) => {
  const [connectionStatus, setConnectionStatus] = useState('good');
  const [bandwidth, setBandwidth] = useState(2.5);
  const [latency, setLatency] = useState(45);
  const [packetLoss, setPacketLoss] = useState(0.1);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [bufferHealth, setBufferHealth] = useState(85);

  useEffect(() => {
    // Simulate connection monitoring
    const interval = setInterval(() => {
      // Simulate network fluctuations
      const newBandwidth = Math.max(0.5, bandwidth + (Math.random() - 0.5) * 0.5);
      const newLatency = Math.max(20, latency + (Math.random() - 0.5) * 20);
      const newPacketLoss = Math.max(0, Math.min(5, packetLoss + (Math.random() - 0.5) * 0.5));
      const newBufferHealth = Math.max(20, Math.min(100, bufferHealth + (Math.random() - 0.5) * 10));

      setBandwidth(newBandwidth);
      setLatency(newLatency);
      setPacketLoss(newPacketLoss);
      setBufferHealth(newBufferHealth);

      // Determine connection quality
      let quality = 'good';
      if (newBandwidth < 1.0 || newLatency > 200 || newPacketLoss > 2) {
        quality = 'poor';
      } else if (newBandwidth < 1.5 || newLatency > 100 || newPacketLoss > 1) {
        quality = 'fair';
      }

      if (quality !== connectionStatus) {
        setConnectionStatus(quality);
        onConnectionChange(quality === 'good');
        onQualityChange(quality);
      }

      // Simulate occasional reconnection
      if (Math.random() < 0.02) {
        setIsReconnecting(true);
        setTimeout(() => setIsReconnecting(false), 3000);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [bandwidth, latency, packetLoss, bufferHealth, connectionStatus, onConnectionChange, onQualityChange]);

  const getStatusColor = () => {
    if (isReconnecting) return 'text-warning';
    switch (connectionStatus) {
      case 'poor': return 'text-error';
      case 'fair': return 'text-warning';
      case 'good': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = () => {
    if (isReconnecting) return 'RefreshCw';
    switch (connectionStatus) {
      case 'poor': return 'WifiOff';
      case 'fair': return 'Wifi';
      case 'good': return 'Wifi';
      default: return 'Wifi';
    }
  };

  const getStatusText = () => {
    if (isReconnecting) return 'Reconnecting...';
    switch (connectionStatus) {
      case 'poor': return 'Poor Connection';
      case 'fair': return 'Fair Connection';
      case 'good': return 'Good Connection';
      default: return 'Checking...';
    }
  };

  const getRecommendation = () => {
    if (isReconnecting) return 'Attempting to restore connection';
    switch (connectionStatus) {
      case 'poor': return 'Consider switching to audio-only mode';
      case 'fair': return 'Video quality may be reduced';
      case 'good': return 'All features available';
      default: return '';
    }
  };

  return (
    <div className="fixed top-20 right-4 z-30 w-80 bg-card border border-border rounded-lg shadow-card p-4">
      {/* Status Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-full bg-muted ${getStatusColor()}`}>
          <Icon 
            name={getStatusIcon()} 
            size={16} 
            className={`${getStatusColor()} ${isReconnecting ? 'animate-spin' : ''}`}
          />
        </div>
        <div>
          <h3 className={`font-semibold ${getStatusColor()}`}>
            {getStatusText()}
          </h3>
          <p className="text-xs text-muted-foreground">
            {getRecommendation()}
          </p>
        </div>
      </div>
      {/* Connection Metrics */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Bandwidth:</span>
          <span className="text-sm font-mono text-foreground">
            {bandwidth?.toFixed(1)} Mbps
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Latency:</span>
          <span className="text-sm font-mono text-foreground">
            {Math.round(latency)}ms
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Packet Loss:</span>
          <span className="text-sm font-mono text-foreground">
            {packetLoss?.toFixed(1)}%
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Buffer Health:</span>
            <span className="text-sm font-mono text-foreground">
              {Math.round(bufferHealth)}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                bufferHealth > 70 ? 'bg-success' : 
                bufferHealth > 40 ? 'bg-warning' : 'bg-error'
              }`}
              style={{ width: `${bufferHealth}%` }}
            />
          </div>
        </div>
      </div>
      {/* Adaptive Quality Info */}
      <div className="mt-4 pt-3 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Adaptive Quality:</span>
          <span className={getStatusColor()}>
            {connectionStatus === 'good' ? 'HD' : 
             connectionStatus === 'fair' ? 'SD' : 'Audio Only'}
          </span>
        </div>
      </div>
      {/* Auto-reconnect Status */}
      {isReconnecting && (
        <div className="mt-3 p-2 bg-warning/10 rounded-lg">
          <div className="flex items-center gap-2">
            <Icon name="RefreshCw" size={12} className="text-warning animate-spin" />
            <span className="text-xs text-warning">
              Auto-reconnecting in progress...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionMonitor;