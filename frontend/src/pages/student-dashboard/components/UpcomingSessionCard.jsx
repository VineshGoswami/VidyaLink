import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UpcomingSessionCard = ({ session, onJoinSession }) => {
  const getConnectionQualityColor = (quality) => {
    switch (quality) {
      case 'good':
        return 'text-success';
      case 'fair':
        return 'text-warning';
      case 'poor':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getConnectionQualityIcon = (quality) => {
    switch (quality) {
      case 'good':
        return 'Wifi';
      case 'fair':
        return 'Wifi';
      case 'poor':
        return 'WifiOff';
      default:
        return 'Wifi';
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString)?.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const isLive = session?.status === 'live';
  const isUpcoming = session?.status === 'upcoming';

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground text-lg mb-1">
            {session?.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-2">
            {session?.instructor}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Icon name="Calendar" size={14} />
              <span>{formatDate(session?.startTime)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon name="Clock" size={14} />
              <span>{formatTime(session?.startTime)} - {formatTime(session?.endTime)}</span>
            </div>
          </div>
        </div>
        {isLive && (
          <div className="flex items-center gap-1 bg-error/10 text-error px-2 py-1 rounded-full text-xs font-medium">
            <div className="w-2 h-2 bg-error rounded-full animate-pulse"></div>
            LIVE
          </div>
        )}
      </div>
      <div className="space-y-3">
        {/* Connection Quality Indicator */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Icon 
              name={getConnectionQualityIcon(session?.connectionQuality)} 
              size={16} 
              className={getConnectionQualityColor(session?.connectionQuality)}
            />
            <span className="text-sm font-medium text-foreground">
              Connection Quality: {session?.connectionQuality}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            Min: {session?.bandwidthRequirement}
          </div>
        </div>

        {/* Session Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Icon name="Users" size={14} className="text-muted-foreground" />
            <span className="text-muted-foreground">
              {session?.enrolledStudents}/{session?.maxCapacity} students
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="Clock" size={14} className="text-muted-foreground" />
            <span className="text-muted-foreground">
              {session?.duration} minutes
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {isLive ? (
            <Button 
              variant="default" 
              className="flex-1"
              iconName="Video"
              iconPosition="left"
              onClick={() => onJoinSession(session?.id)}
            >
              Join Live Session
            </Button>
          ) : isUpcoming ? (
            <Button 
              variant="outline" 
              className="flex-1"
              iconName="Bell"
              iconPosition="left"
            >
              Set Reminder
            </Button>
          ) : (
            <Button 
              variant="secondary" 
              className="flex-1"
              iconName="Play"
              iconPosition="left"
            >
              View Recording
            </Button>
          )}
          
          <Button variant="ghost" size="icon">
            <Icon name="MoreVertical" size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpcomingSessionCard;