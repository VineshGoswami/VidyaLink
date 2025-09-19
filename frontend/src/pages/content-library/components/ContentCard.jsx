import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ContentCard = ({ 
  content, 
  onDownload, 
  onPreview, 
  onBookmark,
  isDownloaded = false,
  downloadProgress = null 
}) => {
  const [selectedQuality, setSelectedQuality] = useState('standard');

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

  const qualityOptions = [
    { value: 'low', label: 'Low Quality', size: content?.fileSize * 0.3, bandwidth: '< 1 Mbps' },
    { value: 'standard', label: 'Standard', size: content?.fileSize * 0.6, bandwidth: '1-2 Mbps' },
    { value: 'high', label: 'High Quality', size: content?.fileSize, bandwidth: '> 2 Mbps' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-all duration-200">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        <Image
          src={content?.thumbnail}
          alt={content?.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPreview(content)}
            className="bg-black/50 text-white hover:bg-black/70"
          >
            <Icon name="Play" size={24} />
          </Button>
        </div>
        
        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs font-mono">
          {formatDuration(content?.duration)}
        </div>

        {/* Download Status */}
        {isDownloaded && (
          <div className="absolute top-2 left-2 bg-success text-success-foreground px-2 py-1 rounded-full text-xs flex items-center gap-1">
            <Icon name="Download" size={12} />
            Downloaded
          </div>
        )}

        {downloadProgress !== null && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-2">
            <div className="flex items-center justify-between text-white text-xs mb-1">
              <span>Downloading...</span>
              <span>{Math.round(downloadProgress)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-1">
              <div 
                className="bg-primary h-1 rounded-full transition-all duration-300"
                style={{ width: `${downloadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>
      {/* Content Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-2">
            {content?.title}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onBookmark(content)}
            className="h-8 w-8 flex-shrink-0 ml-2"
          >
            <Icon 
              name={content?.isBookmarked ? "Bookmark" : "BookmarkPlus"} 
              size={16}
              className={content?.isBookmarked ? "text-primary" : "text-muted-foreground"}
            />
          </Button>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Icon name="User" size={12} />
            <span>{content?.educator}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Icon name="BookOpen" size={12} />
            <span>{content?.subject}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Icon name="Calendar" size={12} />
            <span>{new Date(content.uploadDate)?.toLocaleDateString('en-IN', { 
              day: '2-digit', 
              month: '2-digit', 
              year: 'numeric' 
            })}</span>
          </div>
        </div>

        {/* Quality Selection */}
        <div className="mb-3">
          <label className="text-xs font-medium text-foreground mb-2 block">
            Download Quality:
          </label>
          <div className="grid grid-cols-3 gap-1">
            {qualityOptions?.map((option) => (
              <button
                key={option?.value}
                onClick={() => setSelectedQuality(option?.value)}
                className={`px-2 py-1 text-xs rounded border transition-colors ${
                  selectedQuality === option?.value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-muted-foreground border-border hover:bg-muted'
                }`}
              >
                <div className="font-medium">{option?.label}</div>
                <div className="text-xs opacity-80">{formatFileSize(option?.size)}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {!isDownloaded && downloadProgress === null && (
            <Button
              variant="default"
              size="sm"
              onClick={() => onDownload(content, selectedQuality)}
              className="flex-1"
              iconName="Download"
              iconPosition="left"
              iconSize={14}
            >
              Download
            </Button>
          )}
          
          {isDownloaded && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPreview(content)}
              className="flex-1"
              iconName="Play"
              iconPosition="left"
              iconSize={14}
            >
              Play
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPreview(content)}
            iconName="Eye"
            iconSize={14}
          >
            Preview
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;