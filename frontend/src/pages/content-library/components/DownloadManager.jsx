import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DownloadManager = ({ 
  downloads = [], 
  onPauseDownload, 
  onResumeDownload, 
  onCancelDownload,
  onScheduleDownload,
  className = '' 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [scheduledDownloads, setScheduledDownloads] = useState([]);

  const activeDownloads = downloads?.filter(d => d?.status === 'downloading' || d?.status === 'paused');
  const completedDownloads = downloads?.filter(d => d?.status === 'completed');
  const queuedDownloads = downloads?.filter(d => d?.status === 'queued');

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(1)) + ' ' + sizes?.[i];
  };

  const formatSpeed = (bytesPerSecond) => {
    return formatBytes(bytesPerSecond) + '/s';
  };

  const formatTimeRemaining = (seconds) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
    return `${Math.round(seconds / 3600)}h`;
  };

  const getTotalProgress = () => {
    if (downloads?.length === 0) return 0;
    const totalProgress = downloads?.reduce((sum, download) => sum + download?.progress, 0);
    return totalProgress / downloads?.length;
  };

  if (downloads?.length === 0) return null;

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <Icon name="Download" size={20} className="text-primary" />
            {activeDownloads?.length > 0 && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
            )}
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-foreground">Download Manager</h3>
            <p className="text-sm text-muted-foreground">
              {activeDownloads?.length} active • {completedDownloads?.length} completed
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {activeDownloads?.length > 0 && (
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">
                {Math.round(getTotalProgress())}%
              </p>
              <div className="w-16 bg-muted rounded-full h-1">
                <div 
                  className="bg-primary h-1 rounded-full transition-all duration-300"
                  style={{ width: `${getTotalProgress()}%` }}
                />
              </div>
            </div>
          )}
          <Icon 
            name="ChevronDown" 
            size={16} 
            className={`text-muted-foreground transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>
      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-border">
          {/* Active Downloads */}
          {activeDownloads?.length > 0 && (
            <div className="p-4 border-b border-border">
              <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                <Icon name="Activity" size={14} />
                Active Downloads ({activeDownloads?.length})
              </h4>
              <div className="space-y-3">
                {activeDownloads?.map((download) => (
                  <div key={download?.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {download?.title}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{formatBytes(download?.downloadedSize)} / {formatBytes(download?.totalSize)}</span>
                          {download?.status === 'downloading' && (
                            <>
                              <span>{formatSpeed(download?.speed)}</span>
                              <span>ETA: {formatTimeRemaining(download?.timeRemaining)}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        {download?.status === 'downloading' ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onPauseDownload(download?.id)}
                            className="h-8 w-8"
                          >
                            <Icon name="Pause" size={14} />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onResumeDownload(download?.id)}
                            className="h-8 w-8"
                          >
                            <Icon name="Play" size={14} />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onCancelDownload(download?.id)}
                          className="h-8 w-8 text-error hover:text-error"
                        >
                          <Icon name="X" size={14} />
                        </Button>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          download?.status === 'downloading' ? 'bg-primary' : 'bg-warning'
                        }`}
                        style={{ width: `${download?.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Queued Downloads */}
          {queuedDownloads?.length > 0 && (
            <div className="p-4 border-b border-border">
              <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                <Icon name="Clock" size={14} />
                Queued ({queuedDownloads?.length})
              </h4>
              <div className="space-y-2">
                {queuedDownloads?.map((download, index) => (
                  <div key={download?.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-muted-foreground/20 text-muted-foreground px-2 py-1 rounded">
                        #{index + 1}
                      </span>
                      <span className="text-sm text-foreground">{download?.title}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onCancelDownload(download?.id)}
                      className="h-6 w-6"
                    >
                      <Icon name="X" size={12} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Schedule Downloads */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-foreground flex items-center gap-2">
                <Icon name="Calendar" size={14} />
                Schedule Downloads
              </h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onScheduleDownload()}
                iconName="Plus"
                iconPosition="left"
                iconSize={12}
              >
                Schedule
              </Button>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Wifi" size={14} className="text-primary" />
                <span className="text-sm font-medium text-foreground">Off-Peak Hours</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                Schedule downloads for 11 PM - 6 AM for better bandwidth and lower data costs.
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Icon name="Clock" size={12} />
                <span>Next scheduled: Tonight at 11:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadManager;