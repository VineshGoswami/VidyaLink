import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const DownloadManager = ({ 
  isOpen, 
  onClose, 
  sessionData = {},
  className = '' 
}) => {
  const [downloads, setDownloads] = useState([]);
  const [selectedQuality, setSelectedQuality] = useState('720p');
  const [selectedFormat, setSelectedFormat] = useState('mp4');
  const [storageInfo, setStorageInfo] = useState({ used: 0, available: 0 });
  const [downloadQueue, setDownloadQueue] = useState([]);

  const qualityOptions = [
    { value: '1080p', label: '1080p HD', size: '2.1 GB', bandwidth: '5 Mbps' },
    { value: '720p', label: '720p HD', size: '1.2 GB', bandwidth: '2.5 Mbps' },
    { value: '480p', label: '480p', size: '650 MB', bandwidth: '1.2 Mbps' },
    { value: '360p', label: '360p', size: '420 MB', bandwidth: '0.7 Mbps' },
    { value: 'audio', label: 'Audio Only', size: '85 MB', bandwidth: '128 Kbps' }
  ];

  const formatOptions = [
    { value: 'mp4', label: 'MP4 (Recommended)', description: 'Best compatibility' },
    { value: 'webm', label: 'WebM', description: 'Smaller file size' },
    { value: 'mp3', label: 'MP3 (Audio only)', description: 'Audio format' }
  ];

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
      setStorageInfo({
        used: 450 * 1024 * 1024, // 450MB
        available: 2 * 1024 * 1024 * 1024 // 2GB
      });
    }

    // Mock existing downloads
    setDownloads([
      {
        id: 1,
        title: "VLSI Design Fundamentals - Session 1",
        quality: '720p',
        format: 'mp4',
        size: 1.2 * 1024 * 1024 * 1024,
        downloadedAt: new Date(Date.now() - 86400000),
        status: 'completed'
      },
      {
        id: 2,
        title: "Advanced Circuit Analysis - Session 3",
        quality: '480p',
        format: 'mp4',
        size: 650 * 1024 * 1024,
        downloadedAt: new Date(Date.now() - 172800000),
        status: 'completed'
      }
    ]);
  }, []);

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const getEstimatedSize = () => {
    const quality = qualityOptions?.find(q => q?.value === selectedQuality);
    return quality ? quality?.size : '0 MB';
  };

  const getEstimatedDownloadTime = () => {
    const quality = qualityOptions?.find(q => q?.value === selectedQuality);
    if (!quality) return '0 min';
    
    // Rough estimation based on quality
    const sizeInMB = parseFloat(quality?.size);
    const estimatedMinutes = Math.ceil(sizeInMB / 10); // Assuming 10MB/min average
    return `${estimatedMinutes} min`;
  };

  const handleStartDownload = () => {
    const newDownload = {
      id: Date.now(),
      title: sessionData?.title || "Current Session",
      quality: selectedQuality,
      format: selectedFormat,
      size: 0,
      progress: 0,
      status: 'downloading',
      startedAt: new Date()
    };

    setDownloadQueue(prev => [...prev, newDownload]);

    // Simulate download progress
    const interval = setInterval(() => {
      setDownloadQueue(prev => prev?.map(download => {
        if (download?.id === newDownload?.id && download?.progress < 100) {
          const newProgress = Math.min(download?.progress + Math.random() * 5, 100);
          return {
            ...download,
            progress: newProgress,
            status: newProgress === 100 ? 'completed' : 'downloading'
          };
        }
        return download;
      }));
    }, 500);

    setTimeout(() => {
      clearInterval(interval);
      setDownloadQueue(prev => prev?.map(download => 
        download?.id === newDownload?.id 
          ? { ...download, status: 'completed', progress: 100 }
          : download
      ));
    }, 10000);
  };

  const handleCancelDownload = (downloadId) => {
    setDownloadQueue(prev => prev?.filter(d => d?.id !== downloadId));
  };

  const handleDeleteDownload = (downloadId) => {
    setDownloads(prev => prev?.filter(d => d?.id !== downloadId));
  };

  const storageUsedPercent = (storageInfo?.used / storageInfo?.available) * 100;
  const activeDownloads = downloadQueue?.filter(d => d?.status === 'downloading');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className={`fixed inset-y-0 right-0 w-full max-w-lg bg-card border-l border-border shadow-elevated ${className}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground font-heading">
              Download Manager
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
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Storage Used</span>
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
              {storageUsedPercent > 80 && (
                <p className="text-xs text-error">
                  Storage is running low. Consider deleting old downloads.
                </p>
              )}
            </div>
          </div>

          {/* Download Options */}
          <div className="p-4 border-b border-border">
            <h3 className="font-medium text-foreground mb-4">Download Current Session</h3>
            <div className="space-y-4">
              <Select
                label="Quality"
                options={qualityOptions?.map(option => ({
                  value: option?.value,
                  label: `${option?.label} (${option?.size})`,
                  description: `Bandwidth: ${option?.bandwidth}`
                }))}
                value={selectedQuality}
                onChange={setSelectedQuality}
              />

              <Select
                label="Format"
                options={formatOptions}
                value={selectedFormat}
                onChange={setSelectedFormat}
              />

              <div className="bg-muted/50 rounded-lg p-3">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Estimated size:</span>
                  <span className="font-medium text-foreground">{getEstimatedSize()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Estimated time:</span>
                  <span className="font-medium text-foreground">{getEstimatedDownloadTime()}</span>
                </div>
              </div>

              <Button
                onClick={handleStartDownload}
                className="w-full"
                disabled={activeDownloads?.length > 0}
              >
                <Icon name="Download" size={16} />
                Start Download
              </Button>
            </div>
          </div>

          {/* Active Downloads */}
          {downloadQueue?.length > 0 && (
            <div className="p-4 border-b border-border">
              <h3 className="font-medium text-foreground mb-3">Active Downloads</h3>
              <div className="space-y-3">
                {downloadQueue?.map((download) => (
                  <div key={download?.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground truncate">
                        {download?.title}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {Math.round(download?.progress)}%
                        </span>
                        {download?.status === 'downloading' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCancelDownload(download?.id)}
                            className="h-6 w-6 text-error hover:text-error hover:bg-error/10"
                          >
                            <Icon name="X" size={12} />
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          download?.status === 'completed' ? 'bg-success' : 'bg-primary'
                        }`}
                        style={{ width: `${download?.progress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{download?.quality} • {download?.format}</span>
                      <span className="capitalize">{download?.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Downloaded Files */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <h3 className="font-medium text-foreground mb-3">Downloaded Files ({downloads?.length})</h3>
              {downloads?.length === 0 ? (
                <div className="text-center py-8">
                  <Icon name="Download" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No downloads yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {downloads?.map((download) => (
                    <div key={download?.id} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                      <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                        <Icon name="Check" size={20} className="text-success" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground truncate">
                          {download?.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {download?.quality} • {download?.format} • {formatBytes(download?.size)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Downloaded {download?.downloadedAt?.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          title="Play offline"
                        >
                          <Icon name="Play" size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteDownload(download?.id)}
                          className="h-8 w-8 text-error hover:text-error hover:bg-error/10"
                          title="Delete"
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border bg-muted/30">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{downloads?.length} files downloaded</span>
              <Button variant="ghost" size="sm" className="text-xs">
                Clear All
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadManager;