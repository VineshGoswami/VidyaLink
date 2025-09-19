import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SessionCard = ({ session, onStartSession, onViewDetails }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'live': return 'text-success bg-success/10';
      case 'scheduled': return 'text-primary bg-primary/10';
      case 'completed': return 'text-muted-foreground bg-muted';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getConnectionQuality = (quality) => {
    switch (quality) {
      case 'good': return { color: 'text-success', icon: 'Wifi' };
      case 'fair': return { color: 'text-warning', icon: 'Wifi' };
      case 'poor': return { color: 'text-error', icon: 'WifiOff' };
      default: return { color: 'text-muted-foreground', icon: 'Wifi' };
    }
  };

  const connectionInfo = getConnectionQuality(session?.connectionQuality);

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-card transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {session?.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            {session?.subject} • {session?.duration} minutes
          </p>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Icon name="Calendar" size={16} className="text-muted-foreground" />
              <span className="text-foreground">{session?.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Clock" size={16} className="text-muted-foreground" />
              <span className="text-foreground">{session?.time}</span>
            </div>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(session?.status)}`}>
          {session?.status?.charAt(0)?.toUpperCase() + session?.status?.slice(1)}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="Users" size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Students</span>
          </div>
          <p className="text-lg font-semibold text-foreground">
            {session?.enrolledStudents}/{session?.maxStudents}
          </p>
        </div>
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Icon name={connectionInfo?.icon} size={16} className={connectionInfo?.color} />
            <span className="text-sm font-medium text-foreground">Connection</span>
          </div>
          <p className={`text-lg font-semibold ${connectionInfo?.color}`}>
            {session?.connectionQuality?.charAt(0)?.toUpperCase() + session?.connectionQuality?.slice(1)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {session?.status === 'scheduled' && (
          <Button
            variant="default"
            onClick={() => onStartSession(session?.id)}
            iconName="Play"
            iconPosition="left"
            className="flex-1"
          >
            Start Session
          </Button>
        )}
        {session?.status === 'live' && (
          <Button
            variant="success"
            onClick={() => onStartSession(session?.id)}
            iconName="Video"
            iconPosition="left"
            className="flex-1"
          >
            Join Live
          </Button>
        )}
        <Button
          variant="outline"
          onClick={() => onViewDetails(session?.id)}
          iconName="Eye"
          size="icon"
        />
      </div>
    </div>
  );
};

export default SessionCard;