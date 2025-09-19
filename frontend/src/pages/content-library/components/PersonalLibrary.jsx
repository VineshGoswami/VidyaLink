import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const PersonalLibrary = ({ 
  downloadedContent = [], 
  onPlayContent, 
  onRemoveContent,
  onSyncContent,
  className = '' 
}) => {
  const [sortBy, setSortBy] = useState('recent');
  const [storageInfo, setStorageInfo] = useState({
    used: 450 * 1024 * 1024, // 450MB
    available: 2 * 1024 * 1024 * 1024 // 2GB
  });

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(1)) + ' ' + sizes?.[i];
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getSortedContent = () => {
    const sorted = [...downloadedContent];
    switch (sortBy) {
      case 'recent':
        return sorted?.sort((a, b) => new Date(b.downloadDate) - new Date(a.downloadDate));
      case 'title':
        return sorted?.sort((a, b) => a?.title?.localeCompare(b?.title));
      case 'size':
        return sorted?.sort((a, b) => b?.fileSize - a?.fileSize);
      case 'duration':
        return sorted?.sort((a, b) => b?.duration - a?.duration);
      default:
        return sorted;
    }
  };

  const totalSize = downloadedContent?.reduce((sum, content) => sum + content?.fileSize, 0);
  const storageUsedPercent = (storageInfo?.used / storageInfo?.available) * 100;

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Icon name="FolderOpen" size={16} />
            My Library ({downloadedContent?.length})
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={onSyncContent}
            iconName="RefreshCw"
            iconPosition="left"
            iconSize={12}
          >
            Sync
          </Button>
        </div>

        {/* Storage Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Local Storage</span>
            <span className="font-mono text-foreground">
              {formatBytes(storageInfo?.used)} / {formatBytes(storageInfo?.available)}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                storageUsedPercent > 80 ? 'bg-error' : 
                storageUsedPercent > 60 ? 'bg-warning' : 'bg-success'
              }`}
              style={{ width: `${Math.min(storageUsedPercent, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Content: {formatBytes(totalSize)}</span>
            <span>{Math.round(storageUsedPercent)}% used</span>
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2 mt-4">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <div className="flex gap-1">
            {[
              { value: 'recent', label: 'Recent' },
              { value: 'title', label: 'Title' },
              { value: 'size', label: 'Size' },
              { value: 'duration', label: 'Duration' }
            ]?.map((option) => (
              <button
                key={option?.value}
                onClick={() => setSortBy(option?.value)}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  sortBy === option?.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {option?.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Content List */}
      <div className="p-4">
        {downloadedContent?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Download" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h4 className="font-medium text-foreground mb-2">No Downloaded Content</h4>
            <p className="text-sm text-muted-foreground">
              Download lectures and materials to access them offline
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {getSortedContent()?.map((content) => (
              <div key={content?.id} className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                {/* Thumbnail */}
                <div className="relative w-16 h-12 bg-muted rounded overflow-hidden flex-shrink-0">
                  <Image
                    src={content?.thumbnail}
                    alt={content?.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Icon name="Play" size={16} className="text-white" />
                  </div>
                </div>

                {/* Content Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground text-sm truncate">
                    {content?.title}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span>{content?.educator}</span>
                    <span>•</span>
                    <span>{formatDuration(content?.duration)}</span>
                    <span>•</span>
                    <span>{formatBytes(content?.fileSize)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${
                      content?.syncStatus === 'synced' ? 'bg-success' :
                      content?.syncStatus === 'pending' ? 'bg-warning' : 'bg-error'
                    }`} />
                    <span className="text-xs text-muted-foreground">
                      {content?.syncStatus === 'synced' ? 'Synced' :
                       content?.syncStatus === 'pending' ? 'Sync pending' : 'Sync failed'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onPlayContent(content)}
                    className="h-8 w-8"
                  >
                    <Icon name="Play" size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveContent(content?.id)}
                    className="h-8 w-8 text-error hover:text-error"
                  >
                    <Icon name="Trash2" size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Storage Management */}
      {storageUsedPercent > 70 && (
        <div className="p-4 border-t border-border">
          <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="AlertTriangle" size={14} className="text-warning" />
              <span className="text-sm font-medium text-warning">Storage Warning</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Your storage is {Math.round(storageUsedPercent)}% full. Consider removing old content to free up space.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              iconName="Trash2"
              iconPosition="left"
              iconSize={12}
            >
              Manage Storage
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalLibrary;