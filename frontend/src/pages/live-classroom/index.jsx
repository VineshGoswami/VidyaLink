import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RoleAdaptiveHeader from '../../components/ui/RoleAdaptiveHeader';
import ProgressContextBar from '../../components/ui/ProgressContextBar';
import OfflineContentManager from '../../components/ui/OfflineContentManager';
import VideoPlayer from './components/VideoPlayer';
import ChatPanel from './components/ChatPanel';
import InteractiveControls from './components/InteractiveControls';
import WhiteboardPanel from './components/WhiteboardPanel';
import ConnectionMonitor from './components/ConnectionMonitor';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const LiveClassroom = () => {
  const navigate = useNavigate();
  const [user] = useState({ role: 'student', name: 'Rahul Kumar' });
  const [isConnected, setIsConnected] = useState(true);
  const [connectionQuality, setConnectionQuality] = useState('good');
  const [isAudioOnly, setIsAudioOnly] = useState(false);
  const [isChatCollapsed, setIsChatCollapsed] = useState(false);
  const [isWhiteboardVisible, setIsWhiteboardVisible] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showOfflineManager, setShowOfflineManager] = useState(false);
  const [sessionProgress, setSessionProgress] = useState(65);

  const mockAvailableContent = [
    {
      id: 1,
      title: "VLSI Design Fundamentals - Lecture 1",
      type: "Video",
      size: 125 * 1024 * 1024,
      duration: "1:45:30"
    },
    {
      id: 2,
      title: "CMOS Technology Overview - Slides",
      type: "PDF",
      size: 15 * 1024 * 1024,
      pages: 45
    },
    {
      id: 3,
      title: "Lab Exercise - VLSI Design Tools",
      type: "Document",
      size: 8 * 1024 * 1024,
      pages: 12
    }
  ];

  const mockDownloadedContent = [
    {
      id: 4,
      title: "Previous Session Recording",
      type: "Video",
      size: 98 * 1024 * 1024,
      downloadedAt: new Date(Date.now() - 86400000)
    }
  ];

  const mockDownloadProgress = {
    "lecture_recording.mp4": 45,
    "slides_chapter2.pdf": 78
  };

  const mockLearningMilestones = [
    { id: 1, title: "CMOS Basics", completed: true },
    { id: 2, title: "Logic Gates", completed: true },
    { id: 3, title: "Circuit Design", completed: false },
    { id: 4, title: "Layout Design", completed: false }
  ];

  useEffect(() => {
    // Simulate session progress
    const interval = setInterval(() => {
      setSessionProgress(prev => Math.min(prev + 0.5, 100));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleConnectionChange = (connected) => {
    setIsConnected(connected);
    if (!connected) {
      setIsAudioOnly(true);
    }
  };

  const handleQualityChange = (quality) => {
    setConnectionQuality(quality);
    if (quality === 'poor') {
      setIsAudioOnly(true);
    }
  };

  const handleToggleAudioOnly = () => {
    setIsAudioOnly(!isAudioOnly);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleRaiseHand = () => {
    setIsHandRaised(!isHandRaised);
  };

  const handleToggleAudio = () => {
    setIsAudioOn(!isAudioOn);
  };

  const handleToggleVideo = () => {
    setIsVideoOn(!isVideoOn);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-background">
      <RoleAdaptiveHeader 
        user={user} 
        onNavigate={handleNavigation}
      />

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Main Content Area */}
        <div className={`flex-1 flex flex-col ${isChatCollapsed ? 'mr-12' : 'mr-80'} transition-all duration-300`}>
          {/* Video Player */}
          <div className="flex-1 p-4">
            <VideoPlayer
              isConnected={isConnected}
              connectionQuality={connectionQuality}
              isAudioOnly={isAudioOnly}
              onToggleAudioOnly={handleToggleAudioOnly}
              onToggleFullscreen={handleToggleFullscreen}
              videoUrl="https://example.com/stream"
              title="Advanced VLSI Design"
              duration="02:30:00"
              currentTime={0}
              onTimeUpdate={() => {}}
              onPlayPause={() => {}}
              isPlaying={true}
              quality={connectionQuality}
              onQualityChange={handleQualityChange}
              playbackSpeed={1}
              onSpeedChange={() => {}}
              onChapterSelect={() => {}}
            />
          </div>

          {/* Session Info Bar */}
          <div className="bg-card border-t border-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <h2 className="font-semibold text-foreground">Advanced VLSI Design</h2>
                  <p className="text-sm text-muted-foreground">
                    Dr. Priya Sharma • IIT Delhi • Live Session
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-error/10 text-error px-3 py-1 rounded-full text-sm">
                  <div className="w-2 h-2 bg-error rounded-full animate-pulse"></div>
                  <span>Recording</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowOfflineManager(true)}
                >
                  <Icon name="Download" size={14} className="mr-1" />
                  Offline Content
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsWhiteboardVisible(true)}
                >
                  <Icon name="PenTool" size={14} className="mr-1" />
                  Whiteboard
                </Button>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon name="Users" size={14} />
                  <span>24 participants</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-card border-l border-border flex flex-col">
          {/* Interactive Controls */}
          <div className="p-4 border-b border-border">
            <InteractiveControls
              onRaiseHand={handleRaiseHand}
              onToggleAudio={handleToggleAudio}
              onToggleVideo={handleToggleVideo}
              isHandRaised={isHandRaised}
              isAudioOn={isAudioOn}
              isVideoOn={isVideoOn}
            />
          </div>

          {/* Chat Panel */}
          <div className="flex-1">
            <ChatPanel
              isCollapsed={isChatCollapsed}
              onToggleCollapse={() => setIsChatCollapsed(!isChatCollapsed)}
            />
          </div>
        </div>
      </div>

      {/* Connection Monitor */}
      <ConnectionMonitor
        onConnectionChange={handleConnectionChange}
        onQualityChange={handleQualityChange}
      />

      {/* Progress Context Bar */}
      <ProgressContextBar
        position="bottom"
        sessionProgress={sessionProgress}
        downloadProgress={mockDownloadProgress}
        learningMilestones={mockLearningMilestones}
      />

      {/* Whiteboard Panel */}
      <WhiteboardPanel
        isVisible={isWhiteboardVisible}
        onToggleVisibility={() => setIsWhiteboardVisible(!isWhiteboardVisible)}
      />

      {/* Offline Content Manager */}
      <OfflineContentManager
        isOpen={showOfflineManager}
        onClose={() => setShowOfflineManager(false)}
        availableContent={mockAvailableContent}
        downloadedContent={mockDownloadedContent}
      />

      {/* Mobile Responsive Overlay */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-30">
        <div className="bg-card border border-border rounded-lg p-3 shadow-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant={isHandRaised ? "default" : "outline"}
                size="sm"
                onClick={handleRaiseHand}
              >
                <Icon name="Hand" size={14} />
              </Button>
              <Button
                variant={isAudioOn ? "default" : "outline"}
                size="sm"
                onClick={handleToggleAudio}
              >
                <Icon name={isAudioOn ? "Mic" : "MicOff"} size={14} />
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsChatCollapsed(!isChatCollapsed)}
              >
                <Icon name="MessageSquare" size={14} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsWhiteboardVisible(true)}
              >
                <Icon name="PenTool" size={14} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Connection Status Toast */}
      {!isConnected && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-error text-error-foreground px-4 py-2 rounded-lg shadow-card animate-fade-in">
          <div className="flex items-center gap-2">
            <Icon name="WifiOff" size={16} />
            <span className="text-sm font-medium">Connection lost - Attempting to reconnect</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveClassroom;