import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const OfflineContentManager = ({ 
  className = '',
  isOpen = false,
  onClose = () => {},
  availableContent = [],
  downloadedContent = []
}) => {
  const [storageInfo, setStorageInfo] = useState({ used: 0, available: 0 });
  const [downloadQueue, setDownloadQueue] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [activeTab, setActiveTab] = useState('available');

  useEffect(() => {
    // Simulate storage calculation
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage?.estimate()?.then(estimate => {
        setStorageInfo({
          used: estimate?.usage || 0,
          available: estimate?.quota || 0
        });
      });
    } else {
      // Fallback for browsers without storage API
      setStorageInfo({
        used: 150 * 1024 * 1024, // 150MB
        available: 2 * 1024 * 1024 * 1024 // 2GB
      });
    }
  }, []);

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const handleDownload = (item) => {
    setDownloadQueue(prev => [...prev, { ...item, progress: 0, status: 'queued' }]);
    // Simulate download progress
    const interval = setInterval(() => {
      setDownloadQueue(prev => prev?.map(queueItem => {
        if (queueItem?.id === item?.id && queueItem?.progress < 100) {
          const newProgress = Math.min(queueItem?.progress + Math.random() * 15, 100);
          return { 
            ...queueItem, 
            progress: newProgress,
            status: newProgress === 100 ? 'completed' : 'downloading'
          };
        }
        return queueItem;
      }));
    }, 500);

    setTimeout(() => clearInterval(interval), 8000);
  };

  const handleBatchDownload = () => {
    selectedItems?.forEach(itemId => {
      const item = availableContent?.find(content => content?.id === itemId);
      if (item) handleDownload(item);
    });
    setSelectedItems(new Set());
  };

  const handleRemoveOffline = (itemId) => {
    // Simulate removal from offline storage
    console.log('Removing item from offline storage:', itemId);
  };

  const toggleItemSelection = (itemId) => {
    const newSelected = new Set(selectedItems);
    if (newSelected?.has(itemId)) {
      newSelected?.delete(itemId);
    } else {
      newSelected?.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  if (!isOpen) return null;

  const storageUsedPercent = (storageInfo?.used / storageInfo?.available) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className={`fixed inset-y-0 right-0 w-full max-w-md bg-card border-l border-border shadow-elevated ${className}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground font-heading">
              Offline Content
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <Icon name="X" size={16} />
            </Button>
          </div>

          {/* Storage Info */}
          <div className="p-4 border-b border-border">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Storage Used</span>
                <span className="font-mono text-foreground">
                  {formatBytes(storageInfo?.used)} / {formatBytes(storageInfo?.available)}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full progress-bar ${
                    storageUsedPercent > 80 ? 'bg-error' : 
                    storageUsedPercent > 60 ? 'bg-warning' : 'bg-success'
                  }`}
                  style={{ width: `${Math.min(storageUsedPercent, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveTab('available')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'available' ?'text-primary border-b-2 border-primary' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              Available ({availableContent?.length})
            </button>
            <button
              onClick={() => setActiveTab('downloaded')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'downloaded'
                  ? 'text-primary border-b-2 border-primary' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              Downloaded ({downloadedContent?.length})
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'available' && (
              <div className="p-4 space-y-4">
                {selectedItems?.size > 0 && (
                  <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg">
                    <span className="text-sm text-primary">
                      {selectedItems?.size} selected
                    </span>
                    <Button
                      size="sm"
                      onClick={handleBatchDownload}
                      className="ml-auto"
                    >
                      Download Selected
                    </Button>
                  </div>
                )}

                {availableContent?.map((item) => (
                  <div key={item?.id} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                    <input
                      type="checkbox"
                      checked={selectedItems?.has(item?.id)}
                      onChange={() => toggleItemSelection(item?.id)}
                      className="w-4 h-4 text-primary"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-foreground truncate">
                        {item?.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {item?.type} • {formatBytes(item?.size)}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(item)}
                      disabled={downloadQueue?.some(q => q?.id === item?.id)}
                    >
                      <Icon name="Download" size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'downloaded' && (
              <div className="p-4 space-y-4">
                {downloadedContent?.map((item) => (
                  <div key={item?.id} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                    <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                      <Icon name="Check" size={16} className="text-success" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-foreground truncate">
                        {item?.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Downloaded • {formatBytes(item?.size)}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveOffline(item?.id)}
                      className="text-error hover:text-error hover:bg-error/10"
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Download Queue */}
          {downloadQueue?.length > 0 && (
            <div className="border-t border-border p-4">
              <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <Icon name="Download" size={14} />
                Download Queue ({downloadQueue?.filter(item => item?.status !== 'completed')?.length})
              </h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {downloadQueue?.filter(item => item?.status !== 'completed')?.map((item) => (
                  <div key={item?.id} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground truncate">
                        {item?.title}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">
                        {Math.round(item?.progress)}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1">
                      <div 
                        className="bg-primary h-1 rounded-full progress-bar"
                        style={{ width: `${item?.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfflineContentManager;