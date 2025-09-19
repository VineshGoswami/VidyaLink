import React from 'react';
import Icon from '../../../components/AppIcon';


const QuickActions = ({ onCreateSession, onCreatePoll, onViewAnalytics, onManageContent }) => {
  const actions = [
    {
      id: 'create-session',
      title: 'Create Session',
      description: 'Schedule a new virtual classroom session',
      icon: 'Plus',
      color: 'bg-primary text-primary-foreground',
      onClick: onCreateSession
    },
    {
      id: 'video-conference',
      title: 'Video Conference',
      description: 'Start or join a video conference call',
      icon: 'PhoneCall',
      color: 'bg-info text-info-foreground',
      onClick: () => window.location.href = '/video-conference'
    },
    {
      id: 'create-poll',
      title: 'Create Poll',
      description: 'Design interactive polls for engagement',
      icon: 'BarChart3',
      color: 'bg-secondary text-secondary-foreground',
      onClick: onCreatePoll
    },
    {
      id: 'view-analytics',
      title: 'View Analytics',
      description: 'Check detailed performance metrics',
      icon: 'TrendingUp',
      color: 'bg-success text-success-foreground',
      onClick: onViewAnalytics
    },
    {
      id: 'manage-content',
      title: 'Manage Content',
      description: 'Upload and organize learning materials',
      icon: 'FolderOpen',
      color: 'bg-warning text-warning-foreground',
      onClick: onManageContent
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Icon name="Zap" size={20} />
        Quick Actions
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions?.map((action) => (
          <button
            key={action?.id}
            onClick={action?.onClick}
            className="group p-4 bg-muted/30 hover:bg-muted/50 rounded-lg transition-all duration-200 text-left border border-transparent hover:border-border"
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action?.color} group-hover:scale-110 transition-transform`}>
                <Icon name={action?.icon} size={20} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-foreground mb-1">
                  {action?.title}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {action?.description}
                </p>
              </div>
              <Icon 
                name="ArrowRight" 
                size={16} 
                className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" 
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;