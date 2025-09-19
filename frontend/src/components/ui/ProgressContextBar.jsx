import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const ProgressContextBar = ({ 
  className = '',
  position = 'bottom',
  sessionProgress = 0,
  downloadProgress = {},
  learningMilestones = []
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeDownloads, setActiveDownloads] = useState([]);
  const [completedMilestones, setCompletedMilestones] = useState(0);

  useEffect(() => {
    // Simulate active downloads
    const downloads = Object.entries(downloadProgress)?.filter(([_, progress]) => progress < 100);
    setActiveDownloads(downloads);

    // Calculate completed milestones
    const completed = learningMilestones?.filter(milestone => milestone?.completed)?.length;
    setCompletedMilestones(completed);
  }, [downloadProgress, learningMilestones]);

  const hasActiveContent = sessionProgress > 0 || activeDownloads?.length > 0 || completedMilestones > 0;

  if (!hasActiveContent) return null;

  const positionClasses = {
    bottom: 'fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80',
    side: 'fixed right-4 top-1/2 -translate-y-1/2 w-80',
    top: 'sticky top-16 z-30 mx-4 mt-4'
  };

  return (
    <div className={`${positionClasses?.[position]} z-30 ${className}`}>
      <div className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
        {/* Compact View */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon 
                  name="Activity" 
                  size={16} 
                  className="text-primary"
                />
              </div>
              {activeDownloads?.length > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-warning rounded-full animate-pulse" />
              )}
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">
                Learning Progress
              </p>
              <p className="text-xs text-muted-foreground">
                {sessionProgress > 0 && `Session: ${Math.round(sessionProgress)}%`}
                {activeDownloads?.length > 0 && ` • ${activeDownloads?.length} downloading`}
                {completedMilestones > 0 && ` • ${completedMilestones} completed`}
              </p>
            </div>
          </div>
          <Icon 
            name="ChevronUp" 
            size={16} 
            className={`text-muted-foreground transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Expanded View */}
        {isExpanded && (
          <div className="border-t border-border p-4 space-y-4 animate-fade-in">
            {/* Session Progress */}
            {sessionProgress > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    Current Session
                  </span>
                  <span className="text-sm text-muted-foreground font-mono">
                    {Math.round(sessionProgress)}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full progress-bar"
                    style={{ width: `${sessionProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Active Downloads */}
            {activeDownloads?.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Icon name="Download" size={14} />
                  Downloads ({activeDownloads?.length})
                </h4>
                {activeDownloads?.slice(0, 3)?.map(([filename, progress]) => (
                  <div key={filename} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground truncate">
                        {filename}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1">
                      <div 
                        className="bg-secondary h-1 rounded-full progress-bar"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                ))}
                {activeDownloads?.length > 3 && (
                  <p className="text-xs text-muted-foreground">
                    +{activeDownloads?.length - 3} more downloads
                  </p>
                )}
              </div>
            )}

            {/* Learning Milestones */}
            {learningMilestones?.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Icon name="Target" size={14} />
                  Milestones
                </h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Completed
                  </span>
                  <span className="text-sm font-medium text-success">
                    {completedMilestones}/{learningMilestones?.length}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-success h-2 rounded-full progress-bar"
                    style={{ 
                      width: `${(completedMilestones / learningMilestones?.length) * 100}%` 
                    }}
                  />
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex gap-2 pt-2 border-t border-border">
              <button className="flex-1 px-3 py-2 text-xs bg-muted hover:bg-muted/80 rounded-lg transition-colors">
                View Details
              </button>
              <button className="flex-1 px-3 py-2 text-xs bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors">
                Continue Learning
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressContextBar;