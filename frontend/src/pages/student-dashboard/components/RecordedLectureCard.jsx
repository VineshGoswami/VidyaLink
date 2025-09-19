import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecordedLectureCard = ({ lecture, onPlayLecture, onDownloadLecture }) => {
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(1)) + ' ' + sizes?.[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getQualityColor = (quality) => {
    switch (quality) {
      case 'HD':
        return 'text-success';
      case 'SD':
        return 'text-warning';
      case 'Audio':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        {/* Thumbnail */}
        <div className="relative w-20 h-14 bg-muted rounded-lg overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon name="Play" size={20} className="text-muted-foreground" />
          </div>
          <div className="absolute bottom-1 right-1 bg-background/80 text-xs px-1 rounded text-foreground">
            {formatDuration(lecture?.duration)}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-base mb-1 truncate">
            {lecture?.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-2">
            {lecture?.instructor}
          </p>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Icon name="Calendar" size={12} />
              <span>{formatDate(lecture?.recordedDate)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon name="Eye" size={12} />
              <span>{lecture?.views} views</span>
            </div>
            <div className={`flex items-center gap-1 ${getQualityColor(lecture?.quality)}`}>
              <Icon name="Monitor" size={12} />
              <span>{lecture?.quality}</span>
            </div>
          </div>

          {/* Progress Bar */}
          {lecture?.watchProgress > 0 && (
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>Progress</span>
                <span>{Math.round(lecture?.watchProgress)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1">
                <div 
                  className="bg-primary h-1 rounded-full transition-all duration-300"
                  style={{ width: `${lecture?.watchProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Download Progress */}
          {lecture?.downloadProgress !== undefined && lecture?.downloadProgress < 100 && (
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>Downloading...</span>
                <span>{Math.round(lecture?.downloadProgress)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1">
                <div 
                  className="bg-secondary h-1 rounded-full transition-all duration-300"
                  style={{ width: `${lecture?.downloadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* File Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{formatFileSize(lecture?.fileSize)}</span>
              {lecture?.isOfflineAvailable && (
                <div className="flex items-center gap-1 text-success">
                  <Icon name="Download" size={12} />
                  <span>Offline</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8"
                onClick={() => onPlayLecture(lecture?.id)}
              >
                <Icon name="Play" size={14} />
              </Button>
              
              {!lecture?.isOfflineAvailable && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onDownloadLecture(lecture?.id)}
                  disabled={lecture?.downloadProgress !== undefined && lecture?.downloadProgress < 100}
                >
                  <Icon name="Download" size={14} />
                </Button>
              )}
              
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Icon name="MoreVertical" size={14} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordedLectureCard;