import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VideoPlayer = ({ 
  isConnected = true, 
  connectionQuality = 'good',
  isAudioOnly = false,
  onToggleAudioOnly = () => {},
  onToggleFullscreen = () => {}
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef(null);

  const mockEducatorData = {
    name: "Dr. Priya Sharma",
    subject: "Advanced VLSI Design",
    institution: "IIT Delhi",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowControls(false), 3000);
    return () => clearTimeout(timer);
  }, [showControls]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e?.target?.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const getQualityColor = () => {
    switch (connectionQuality) {
      case 'poor': return 'text-error';
      case 'fair': return 'text-warning';
      case 'good': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getQualityLabel = () => {
    switch (connectionQuality) {
      case 'poor': return 'Poor (Audio Only)';
      case 'fair': return 'Fair (Low Quality)';
      case 'good': return 'Good (HD)';
      default: return 'Checking...';
    }
  };

  return (
    <div 
      className="relative bg-black rounded-lg overflow-hidden aspect-video group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Video/Audio Display */}
      {isAudioOnly ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
          <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-4">
            <Icon name="Mic" size={32} className="text-primary" />
          </div>
          <h3 className="text-white text-lg font-semibold mb-2">{mockEducatorData?.name}</h3>
          <p className="text-white/80 text-sm">{mockEducatorData?.subject}</p>
          <div className="flex items-center gap-2 mt-4">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-white/60 text-xs">Audio Only Mode</span>
          </div>
        </div>
      ) : (
        <div className="w-full h-full bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Icon name="Video" size={48} className="text-primary" />
            </div>
            <p className="text-white/80">Video feed will appear here</p>
            <p className="text-white/60 text-sm mt-2">Connecting to educator...</p>
          </div>
        </div>
      )}
      {/* Connection Status Overlay */}
      {!isConnected && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
          <div className="text-center text-white">
            <Icon name="WifiOff" size={48} className="text-error mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Connection Lost</h3>
            <p className="text-white/80 mb-4">Attempting to reconnect...</p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      )}
      {/* Controls Overlay */}
      {showControls && isConnected && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30">
          {/* Top Controls */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-black/50 rounded-full px-3 py-1">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-white text-xs font-medium">LIVE</span>
              </div>
              <div className={`flex items-center gap-2 bg-black/50 rounded-full px-3 py-1 ${getQualityColor()}`}>
                <Icon name="Wifi" size={12} />
                <span className="text-xs font-medium">{getQualityLabel()}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleFullscreen}
              className="bg-black/50 text-white hover:bg-black/70"
            >
              <Icon name="Maximize" size={16} />
            </Button>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePlayPause}
                  className="bg-black/50 text-white hover:bg-black/70"
                >
                  <Icon name={isPlaying ? "Pause" : "Play"} size={16} />
                </Button>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleMuteToggle}
                    className="bg-black/50 text-white hover:bg-black/70"
                  >
                    <Icon name={isMuted ? "VolumeX" : "Volume2"} size={16} />
                  </Button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-white/30 rounded-lg appearance-none slider"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleAudioOnly}
                  className={`bg-black/50 text-white hover:bg-black/70 ${isAudioOnly ? 'bg-primary/50' : ''}`}
                >
                  <Icon name="Headphones" size={14} className="mr-1" />
                  Audio Only
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Educator Info */}
      <div className="absolute bottom-4 left-4 bg-black/70 rounded-lg p-3 text-white max-w-xs">
        <div className="flex items-center gap-3">
          <img
            src={mockEducatorData?.avatar}
            alt={mockEducatorData?.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h4 className="font-semibold text-sm">{mockEducatorData?.name}</h4>
            <p className="text-xs text-white/80">{mockEducatorData?.subject}</p>
            <p className="text-xs text-white/60">{mockEducatorData?.institution}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;