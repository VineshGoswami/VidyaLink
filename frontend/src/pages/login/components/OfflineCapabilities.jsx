import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const OfflineCapabilities = ({ isVisible = false, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isVisible) return null;

  const offlineFeatures = [
    {
      icon: 'BookOpen',
      title: 'Cached Content',
      description: 'Access previously downloaded lectures and materials'
    },
    {
      icon: 'FileText',
      title: 'Study Notes',
      description: 'View and edit your personal study notes offline'
    },
    {
      icon: 'Clock',
      title: 'Schedule Sync',
      description: 'Check upcoming classes and assignments'
    },
    {
      icon: 'BarChart3',
      title: 'Progress Tracking',
      description: 'Review your learning progress and achievements'
    }
  ];

  return (
    <div className={`bg-muted/50 border border-border rounded-lg overflow-hidden ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-muted/70 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Download" size={16} className="text-primary" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-medium text-foreground">
              Offline Capabilities
            </h3>
            <p className="text-xs text-muted-foreground">
              Available features without internet
            </p>
          </div>
        </div>
        <Icon 
          name="ChevronDown" 
          size={16} 
          className={`text-muted-foreground transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isExpanded && (
        <div className="border-t border-border p-4 space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {offlineFeatures?.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-card rounded-lg">
                <div className="w-6 h-6 bg-primary/10 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon name={feature?.icon} size={14} className="text-primary" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-medium text-foreground">
                    {feature?.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {feature?.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              fullWidth
              iconName="RefreshCw"
              iconPosition="left"
            >
              Sync When Connected
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfflineCapabilities;