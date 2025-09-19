import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ContentLibraryWidget = ({ contentItems, onUploadContent, onViewLibrary }) => {
  const getFileTypeIcon = (type) => {
    switch (type) {
      case 'video': return 'Video';
      case 'pdf': return 'FileText';
      case 'presentation': return 'Presentation';
      case 'audio': return 'Headphones';
      default: return 'File';
    }
  };

  const getOptimizationStatus = (status) => {
    switch (status) {
      case 'optimized':
        return { color: 'text-success', bg: 'bg-success/10', label: 'Optimized' };
      case 'processing':
        return { color: 'text-warning', bg: 'bg-warning/10', label: 'Processing' };
      case 'pending':
        return { color: 'text-muted-foreground', bg: 'bg-muted', label: 'Pending' };
      default:
        return { color: 'text-muted-foreground', bg: 'bg-muted', label: 'Unknown' };
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Icon name="FolderOpen" size={20} />
          Content Library
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onUploadContent}
            iconName="Upload"
            iconPosition="left"
          >
            Upload
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewLibrary}
            iconName="ExternalLink"
            iconPosition="left"
          >
            View All
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        {contentItems?.slice(0, 5)?.map((item) => {
          const optimizationStatus = getOptimizationStatus(item?.optimizationStatus);
          
          return (
            <div key={item?.id} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon 
                  name={getFileTypeIcon(item?.type)} 
                  size={20} 
                  className="text-primary" 
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground truncate">
                  {item?.title}
                </h4>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {formatFileSize(item?.size)}
                  </span>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${optimizationStatus?.color} ${optimizationStatus?.bg}`}>
                    {optimizationStatus?.label}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  {item?.downloads} downloads
                </p>
                <p className="text-xs text-muted-foreground">
                  {item?.lastAccessed}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
              >
                <Icon name="MoreVertical" size={16} />
              </Button>
            </div>
          );
        })}
      </div>
      {contentItems?.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="FolderOpen" size={32} className="text-muted-foreground" />
          </div>
          <h4 className="text-lg font-medium text-foreground mb-2">No Content Yet</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Upload your first content to get started with your virtual classroom.
          </p>
          <Button
            variant="default"
            onClick={onUploadContent}
            iconName="Upload"
            iconPosition="left"
          >
            Upload Content
          </Button>
        </div>
      )}
    </div>
  );
};

export default ContentLibraryWidget;