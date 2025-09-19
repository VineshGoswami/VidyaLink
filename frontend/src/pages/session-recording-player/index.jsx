import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import RoleAdaptiveHeader from '../../components/ui/RoleAdaptiveHeader';
import ProgressContextBar from '../../components/ui/ProgressContextBar';
import OfflineContentManager from '../../components/ui/OfflineContentManager';

// Import components
import VideoPlayer from './components/VideoPlayer';
import TranscriptPanel from './components/TranscriptPanel';
import ChapterNavigation from './components/ChapterNavigation';
import NotesPanel from './components/NotesPanel';
import DownloadManager from './components/DownloadManager';
import InteractiveQuiz from './components/InteractiveQuiz';

const SessionRecordingPlayer = () => {
  const navigate = useNavigate();
  const [currentUser] = useState({ role: 'student', name: 'Priya Sharma' });
  
  // Video state
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(1200); // 20 minutes
  const [isPlaying, setIsPlaying] = useState(false);
  const [quality, setQuality] = useState('720p');
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [bufferProgress, setBufferProgress] = useState(85);
  const [connectionQuality, setConnectionQuality] = useState('good');
  
  // Panel states
  const [isTranscriptCollapsed, setIsTranscriptCollapsed] = useState(false);
  const [isNotesCollapsed, setIsNotesCollapsed] = useState(true);
  const [showDownloadManager, setShowDownloadManager] = useState(false);
  const [showOfflineManager, setShowOfflineManager] = useState(false);
  
  // Session data
  const [sessionData] = useState({
    id: 'vlsi-001',
    title: 'Advanced VLSI Design Principles - Session 1',
    instructor: 'Dr. Sarah Chen',
    subject: 'VLSI Design',
    duration: 1200,
    recordedAt: new Date('2024-09-15T14:30:00'),
    description: 'Comprehensive introduction to VLSI design fundamentals, covering MOSFET physics, scaling challenges, and power optimization techniques.',
    videoUrl: 'https://example.com/vlsi-session-1.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=450&fit=crop',
    tags: ['VLSI', 'Semiconductor', 'Circuit Design', 'Electronics'],
    viewCount: 1247,
    rating: 4.8
  });

  // Mock progress data
  const [sessionProgress, setSessionProgress] = useState(35);
  const [downloadProgress] = useState({
    'vlsi-session-2.mp4': 67,
    'circuit-analysis-notes.pdf': 23
  });
  const [learningMilestones] = useState([
    { id: 1, title: 'MOSFET Basics', completed: true },
    { id: 2, title: 'Scaling Theory', completed: true },
    { id: 3, title: 'Power Analysis', completed: false },
    { id: 4, title: 'Layout Design', completed: false }
  ]);

  // Mock offline content
  const [availableContent] = useState([
    {
      id: 1,
      title: 'VLSI Design Session 2',
      type: 'Video',
      size: 1.2 * 1024 * 1024 * 1024,
      duration: 1800
    },
    {
      id: 2,
      title: 'Circuit Analysis Notes',
      type: 'PDF',
      size: 15 * 1024 * 1024,
      pages: 45
    }
  ]);

  const [downloadedContent] = useState([
    {
      id: 3,
      title: 'Introduction to Semiconductors',
      type: 'Video',
      size: 850 * 1024 * 1024,
      downloadedAt: new Date('2024-09-17T10:00:00')
    }
  ]);

  useEffect(() => {
    // Update session progress based on current time
    const progress = (currentTime / duration) * 100;
    setSessionProgress(progress);

    // Simulate connection quality changes
    const interval = setInterval(() => {
      const qualities = ['poor', 'fair', 'good'];
      const randomQuality = qualities?.[Math.floor(Math.random() * qualities?.length)];
      setConnectionQuality(randomQuality);
      
      // Adjust buffer progress based on connection
      const bufferMap = { poor: 45, fair: 70, good: 95 };
      setBufferProgress(bufferMap?.[randomQuality] + Math.random() * 5);
    }, 30000);

    return () => clearInterval(interval);
  }, [currentTime, duration]);

  const handleTimeUpdate = (time) => {
    setCurrentTime(time);
  };

  const handlePlayPause = (playing) => {
    setIsPlaying(playing);
  };

  const handleQualityChange = (newQuality) => {
    setQuality(newQuality);
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
  };

  const handleChapterSelect = (startTime) => {
    setCurrentTime(startTime);
  };

  const handleSeekTo = (time) => {
    setCurrentTime(time);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <RoleAdaptiveHeader 
        user={currentUser}
        onNavigate={handleNavigation}
      />
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Session Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/content-library')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Icon name="ArrowLeft" size={16} />
                  Back to Library
                </Button>
                <span className="text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">{sessionData?.subject}</span>
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {sessionData?.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Icon name="User" size={16} />
                  <span>{sessionData?.instructor}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Icon name="Clock" size={16} />
                  <span>{formatTime(sessionData?.duration)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Icon name="Calendar" size={16} />
                  <span>{sessionData?.recordedAt?.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Icon name="Eye" size={16} />
                  <span>{sessionData?.viewCount?.toLocaleString()} views</span>
                </div>
                <div className="flex items-center gap-1">
                  <Icon name="Star" size={16} className="text-warning fill-current" />
                  <span>{sessionData?.rating}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowOfflineManager(true)}
              >
                <Icon name="Wifi" size={16} />
                Offline
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDownloadManager(true)}
              >
                <Icon name="Download" size={16} />
                Download
              </Button>
            </div>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-2 flex-wrap">
            {sessionData?.tags?.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Video Player - Takes up more space */}
          <div className="lg:col-span-3 space-y-6">
            <VideoPlayer
              videoUrl={sessionData?.videoUrl}
              title={sessionData?.title}
              duration={duration}
              currentTime={currentTime}
              onTimeUpdate={handleTimeUpdate}
              onPlayPause={handlePlayPause}
              isPlaying={isPlaying}
              quality={quality}
              onQualityChange={handleQualityChange}
              playbackSpeed={playbackSpeed}
              onSpeedChange={handleSpeedChange}
              onChapterSelect={handleChapterSelect}
              bufferProgress={bufferProgress}
              connectionQuality={connectionQuality}
            />

            {/* Interactive Quiz */}
            <InteractiveQuiz
              currentTime={currentTime}
              onSeekTo={handleSeekTo}
            />

            {/* Session Description */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-3">About this session</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {sessionData?.description}
              </p>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm">
                  <Icon name="Share2" size={16} />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Icon name="Bookmark" size={16} />
                  Save
                </Button>
                <Button variant="outline" size="sm">
                  <Icon name="Flag" size={16} />
                  Report
                </Button>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Chapter Navigation */}
            <ChapterNavigation
              currentTime={currentTime}
              onChapterSelect={handleChapterSelect}
            />

            {/* Transcript Panel */}
            <TranscriptPanel
              currentTime={currentTime}
              onSeekTo={handleSeekTo}
              isCollapsed={isTranscriptCollapsed}
              onToggleCollapse={() => setIsTranscriptCollapsed(!isTranscriptCollapsed)}
            />

            {/* Notes Panel */}
            <NotesPanel
              currentTime={currentTime}
              onSeekTo={handleSeekTo}
              isCollapsed={isNotesCollapsed}
              onToggleCollapse={() => setIsNotesCollapsed(!isNotesCollapsed)}
            />
          </div>
        </div>

        {/* Related Content */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-foreground mb-6">Related Sessions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                id: 2,
                title: 'VLSI Design Session 2: Advanced Topics',
                instructor: 'Dr. Sarah Chen',
                duration: 1800,
                thumbnail: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=225&fit=crop',
                progress: 0
              },
              {
                id: 3,
                title: 'Circuit Analysis Fundamentals',
                instructor: 'Prof. Raj Kumar',
                duration: 1500,
                thumbnail: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=400&h=225&fit=crop',
                progress: 45
              },
              {
                id: 4,
                title: 'Digital System Design',
                instructor: 'Dr. Anita Patel',
                duration: 2100,
                thumbnail: 'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=400&h=225&fit=crop',
                progress: 0
              }
            ]?.map((session) => (
              <div
                key={session?.id}
                className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-card transition-shadow cursor-pointer"
                onClick={() => navigate(`/session-recording-player?id=${session?.id}`)}
              >
                <div className="relative aspect-video">
                  <img
                    src={session?.thumbnail}
                    alt={session?.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                      <Icon name="Play" size={24} className="text-black ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {formatTime(session?.duration)}
                  </div>
                  {session?.progress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
                      <div 
                        className="h-full bg-primary"
                        style={{ width: `${session?.progress}%` }}
                      />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-foreground mb-2 line-clamp-2">
                    {session?.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {session?.instructor}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Progress Context Bar */}
      <ProgressContextBar
        position="bottom"
        sessionProgress={sessionProgress}
        downloadProgress={downloadProgress}
        learningMilestones={learningMilestones}
      />
      {/* Download Manager Modal */}
      <DownloadManager
        isOpen={showDownloadManager}
        onClose={() => setShowDownloadManager(false)}
        sessionData={sessionData}
        onPauseDownload={() => {}}
        onResumeDownload={() => {}}
        onCancelDownload={() => {}}
        onScheduleDownload={() => {}}
      />
      {/* Offline Content Manager */}
      <OfflineContentManager
        isOpen={showOfflineManager}
        onClose={() => setShowOfflineManager(false)}
        availableContent={availableContent}
        downloadedContent={downloadedContent}
      />
    </div>
  );
};

export default SessionRecordingPlayer;