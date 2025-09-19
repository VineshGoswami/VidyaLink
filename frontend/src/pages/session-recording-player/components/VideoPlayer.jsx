import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VideoPlayer = ({ 
  videoUrl, 
  title, 
  duration, 
  currentTime, 
  onTimeUpdate, 
  onPlayPause,
  isPlaying,
  quality,
  onQualityChange,
  playbackSpeed,
  onSpeedChange,
  chapters = [],
  onChapterSelect,
  bufferProgress = 0,
  connectionQuality = 'good'
}) => {
  const videoRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackMode, setPlaybackMode] = useState('video'); // video, audio, slides
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  const qualityOptions = [
    { value: 'auto', label: 'Auto', bandwidth: 'Adaptive' },
    { value: '720p', label: '720p HD', bandwidth: '2.5 Mbps' },
    { value: '480p', label: '480p', bandwidth: '1.2 Mbps' },
    { value: '360p', label: '360p', bandwidth: '0.7 Mbps' },
    { value: '240p', label: '240p', bandwidth: '0.3 Mbps' },
    { value: 'audio', label: 'Audio Only', bandwidth: '64 Kbps' }
  ];

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  useEffect(() => {
    const video = videoRef?.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      onTimeUpdate(video?.currentTime);
    };

    const handleLoadedMetadata = () => {
      video.volume = volume;
    };

    video?.addEventListener('timeupdate', handleTimeUpdate);
    video?.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video?.removeEventListener('timeupdate', handleTimeUpdate);
      video?.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [onTimeUpdate, volume]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const handleSeek = (e) => {
    const video = videoRef?.current;
    if (!video) return;

    const rect = e?.currentTarget?.getBoundingClientRect();
    const pos = (e?.clientX - rect?.left) / rect?.width;
    const newTime = pos * duration;
    video.currentTime = newTime;
    onTimeUpdate(newTime);
  };

  const togglePlayPause = () => {
    const video = videoRef?.current;
    if (!video) return;

    if (isPlaying) {
      video?.pause();
    } else {
      video?.play();
    }
    onPlayPause(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef?.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e?.target?.value);
    setVolume(newVolume);
    if (videoRef?.current) {
      videoRef.current.volume = newVolume;
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef?.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const getConnectionIndicator = () => {
    const indicators = {
      poor: { color: 'text-error', icon: 'Wifi', bars: 1 },
      fair: { color: 'text-warning', icon: 'Wifi', bars: 2 },
      good: { color: 'text-success', icon: 'Wifi', bars: 3 }
    };
    return indicators?.[connectionQuality] || indicators?.good;
  };

  const connectionIndicator = getConnectionIndicator();

  return (
    <div className="relative bg-black rounded-lg overflow-hidden group">
      {/* Video Element */}
      <div className="relative aspect-video">
        {playbackMode === 'video' && (
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-contain"
            playsInline
            onPlay={() => onPlayPause(true)}
            onPause={() => onPlayPause(false)}
          />
        )}
        
        {playbackMode === 'audio' && (
          <div className="w-full h-full flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Icon name="Volume2" size={48} className="text-primary" />
              </div>
              <h3 className="text-white text-lg font-medium mb-2">{title}</h3>
              <p className="text-gray-400 text-sm">Audio Only Mode</p>
            </div>
          </div>
        )}

        {playbackMode === 'slides' && (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <div className="text-center">
              <div className="w-24 h-24 bg-secondary/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Icon name="FileText" size={48} className="text-secondary" />
              </div>
              <h3 className="text-white text-lg font-medium mb-2">Slide Sync Mode</h3>
              <p className="text-gray-400 text-sm">Synchronized with audio</p>
            </div>
          </div>
        )}

        {/* Buffer Indicator */}
        {bufferProgress < 100 && (
          <div className="absolute top-4 right-4 bg-black/70 rounded-lg px-3 py-2">
            <div className="flex items-center gap-2">
              <div className="animate-spin">
                <Icon name="Loader2" size={16} className="text-white" />
              </div>
              <span className="text-white text-sm">Buffering {Math.round(bufferProgress)}%</span>
            </div>
          </div>
        )}

        {/* Connection Quality Indicator */}
        <div className="absolute top-4 left-4 bg-black/70 rounded-lg px-3 py-2">
          <div className="flex items-center gap-2">
            <Icon 
              name={connectionIndicator?.icon} 
              size={16} 
              className={connectionIndicator?.color} 
            />
            <span className="text-white text-sm capitalize">{connectionQuality}</span>
          </div>
        </div>

        {/* Play/Pause Overlay */}
        <div 
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={togglePlayPause}
        >
          {!isPlaying && (
            <div className="w-20 h-20 bg-black/70 rounded-full flex items-center justify-center">
              <Icon name="Play" size={32} className="text-white ml-1" />
            </div>
          )}
        </div>
      </div>
      {/* Controls */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        {/* Progress Bar */}
        <div className="mb-4">
          <div 
            className="w-full h-2 bg-white/20 rounded-full cursor-pointer relative"
            onClick={handleSeek}
          >
            {/* Buffer Progress */}
            <div 
              className="absolute top-0 left-0 h-full bg-white/30 rounded-full"
              style={{ width: `${(bufferProgress / 100) * 100}%` }}
            />
            {/* Play Progress */}
            <div 
              className="absolute top-0 left-0 h-full bg-primary rounded-full"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
            {/* Chapters */}
            {chapters?.map((chapter, index) => (
              <div
                key={index}
                className="absolute top-0 w-1 h-full bg-white/60"
                style={{ left: `${(chapter?.startTime / duration) * 100}%` }}
                title={chapter?.title}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          {/* Left Controls */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlayPause}
              className="text-white hover:bg-white/20"
            >
              <Icon name={isPlaying ? "Pause" : "Play"} size={20} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className="text-white hover:bg-white/20"
            >
              <Icon name={isMuted ? "VolumeX" : "Volume2"} size={20} />
            </Button>

            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-white/20 rounded-full appearance-none slider"
              />
            </div>

            <span className="text-white text-sm font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Center Controls - Playback Mode */}
          <div className="flex items-center gap-2 bg-black/50 rounded-lg p-1">
            {['video', 'audio', 'slides']?.map((mode) => (
              <button
                key={mode}
                onClick={() => setPlaybackMode(mode)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  playbackMode === mode
                    ? 'bg-primary text-primary-foreground'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                {mode === 'video' && <Icon name="Video" size={16} />}
                {mode === 'audio' && <Icon name="Volume2" size={16} />}
                {mode === 'slides' && <Icon name="FileText" size={16} />}
              </button>
            ))}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Speed Control */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="text-white hover:bg-white/20 text-sm"
              >
                {playbackSpeed}x
              </Button>
              {showSpeedMenu && (
                <div className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg p-2 min-w-[100px]">
                  {speedOptions?.map((speed) => (
                    <button
                      key={speed}
                      onClick={() => {
                        onSpeedChange(speed);
                        setShowSpeedMenu(false);
                      }}
                      className={`block w-full text-left px-3 py-1 rounded text-sm transition-colors ${
                        playbackSpeed === speed
                          ? 'bg-primary text-primary-foreground'
                          : 'text-white hover:bg-white/20'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quality Control */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowQualityMenu(!showQualityMenu)}
                className="text-white hover:bg-white/20"
              >
                <Icon name="Settings" size={20} />
              </Button>
              {showQualityMenu && (
                <div className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg p-2 min-w-[150px]">
                  {qualityOptions?.map((option) => (
                    <button
                      key={option?.value}
                      onClick={() => {
                        onQualityChange(option?.value);
                        setShowQualityMenu(false);
                      }}
                      className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                        quality === option?.value
                          ? 'bg-primary text-primary-foreground'
                          : 'text-white hover:bg-white/20'
                      }`}
                    >
                      <div className="flex justify-between">
                        <span>{option?.label}</span>
                        <span className="text-xs opacity-70">{option?.bandwidth}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="text-white hover:bg-white/20"
            >
              <Icon name={isFullscreen ? "Minimize" : "Maximize"} size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;