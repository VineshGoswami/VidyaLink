import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UpcomingSchedule = ({ upcomingSessions, onJoinSession, onReschedule }) => {
  const getTimeUntilSession = (dateTime) => {
    const now = new Date();
    const sessionTime = new Date(dateTime);
    const diffMs = sessionTime - now;
    
    if (diffMs < 0) return 'Started';
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    } else {
      return `${diffMinutes}m`;
    }
  };

  const getUrgencyColor = (dateTime) => {
    const now = new Date();
    const sessionTime = new Date(dateTime);
    const diffMs = sessionTime - now;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes <= 0) return 'text-error bg-error/10';
    if (diffMinutes <= 15) return 'text-warning bg-warning/10';
    if (diffMinutes <= 60) return 'text-primary bg-primary/10';
    return 'text-muted-foreground bg-muted';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Icon name="Calendar" size={20} />
          Upcoming Schedule
        </h3>
        <Button
          variant="ghost"
          size="sm"
          iconName="Plus"
          iconPosition="left"
        >
          Add Session
        </Button>
      </div>
      <div className="space-y-3">
        {upcomingSessions?.length > 0 ? (
          upcomingSessions?.slice(0, 4)?.map((session) => {
            const timeUntil = getTimeUntilSession(session?.dateTime);
            const urgencyColor = getUrgencyColor(session?.dateTime);
            
            return (
              <div key={session?.id} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-foreground mb-1">
                    {session?.title}
                  </h4>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Icon name="Clock" size={12} />
                      <span>{new Date(session.dateTime)?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon name="Users" size={12} />
                      <span>{session?.enrolledStudents} students</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon name="BookOpen" size={12} />
                      <span>{session?.subject}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${urgencyColor}`}>
                    {timeUntil === 'Started' ? 'Live Now' : `in ${timeUntil}`}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {timeUntil === 'Started' ? (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => onJoinSession(session?.id)}
                      iconName="Video"
                    />
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onReschedule(session?.id)}
                        iconName="Edit"
                      />
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => onJoinSession(session?.id)}
                        iconName="Play"
                      />
                    </>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Calendar" size={32} className="text-muted-foreground" />
            </div>
            <h4 className="text-lg font-medium text-foreground mb-2">No Upcoming Sessions</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Schedule your first session to start teaching.
            </p>
            <Button
              variant="default"
              iconName="Plus"
              iconPosition="left"
            >
              Schedule Session
            </Button>
          </div>
        )}
      </div>
      {upcomingSessions?.length > 4 && (
        <div className="mt-4 pt-4 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            iconName="ChevronDown"
            iconPosition="right"
          >
            View All Sessions ({upcomingSessions?.length})
          </Button>
        </div>
      )}
    </div>
  );
};

export default UpcomingSchedule;