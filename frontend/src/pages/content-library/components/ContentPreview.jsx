import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const ContentPreview = ({ 
  content, 
  isOpen, 
  onClose, 
  onDownload,
  onBookmark,
  onAddNote 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showChapters, setShowChapters] = useState(false);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const audioRef = useRef(null);

  useEffect(() => {
    if (content && audioRef?.current) {
      audioRef?.current?.load();
    }
  }, [content]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds?.toString()?.padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (audioRef?.current) {
      if (isPlaying) {
        audioRef?.current?.pause();
      } else {
        audioRef?.current?.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e) => {
    const rect = e?.currentTarget?.getBoundingClientRect();
    const percent = (e?.clientX - rect?.left) / rect?.width;
    const newTime = percent * duration;
    if (audioRef?.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e?.target?.value);
    setVolume(newVolume);
    if (audioRef?.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleSpeedChange = (speed) => {
    setPlaybackRate(speed);
    if (audioRef?.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  const handleAddNote = () => {
    if (newNote?.trim()) {
      const note = {
        id: Date.now(),
        text: newNote,
        timestamp: currentTime,
        createdAt: new Date()?.toISOString()
      };
      setNotes([...notes, note]);
      setNewNote('');
      onAddNote(note);
    }
  };

  const jumpToChapter = (timestamp) => {
    if (audioRef?.current) {
      audioRef.current.currentTime = timestamp;
      setCurrentTime(timestamp);
    }
  };

  if (!isOpen || !content) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-4 md:inset-8 bg-card border border-border rounded-lg shadow-elevated overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-muted rounded overflow-hidden">
                <Image
                  src={content?.thumbnail}
                  alt={content?.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">{content?.title}</h2>
                <p className="text-sm text-muted-foreground">{content?.educator}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Main Preview Area */}
            <div className="flex-1 flex flex-col">
              {/* Audio Player */}
              <div className="p-6 border-b border-border">
                <audio
                  ref={audioRef}
                  onTimeUpdate={(e) => setCurrentTime(e?.target?.currentTime)}
                  onLoadedMetadata={(e) => setDuration(e?.target?.duration)}
                  onEnded={() => setIsPlaying(false)}
                  preload="metadata"
                >
                  <source src={content?.audioPreviewUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>

                {/* Progress Bar */}
                <div 
                  className="w-full bg-muted rounded-full h-2 mb-4 cursor-pointer"
                  onClick={handleSeek}
                >
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-100"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handlePlayPause}
                      className="h-12 w-12"
                    >
                      <Icon name={isPlaying ? "Pause" : "Play"} size={24} />
                    </Button>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{formatTime(currentTime)}</span>
                      <span>/</span>
                      <span>{formatTime(duration)}</span>
                    </div>

                    {/* Speed Control */}
                    <div className="flex items-center gap-1">
                      {[0.75, 1, 1.25, 1.5, 2]?.map((speed) => (
                        <button
                          key={speed}
                          onClick={() => handleSpeedChange(speed)}
                          className={`px-2 py-1 text-xs rounded transition-colors ${
                            playbackRate === speed
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground hover:bg-muted/80'
                          }`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Volume Control */}
                  <div className="flex items-center gap-2">
                    <Icon name="Volume2" size={16} className="text-muted-foreground" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-20"
                    />
                  </div>
                </div>
              </div>

              {/* Content Info */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {content?.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-xs text-muted-foreground">Duration</span>
                      <p className="font-medium text-foreground">
                        {Math.floor(content?.duration / 60)}m {content?.duration % 60}s
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Subject</span>
                      <p className="font-medium text-foreground">{content?.subject}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Upload Date</span>
                      <p className="font-medium text-foreground">
                        {new Date(content.uploadDate)?.toLocaleDateString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">File Size</span>
                      <p className="font-medium text-foreground">
                        {(content?.fileSize / (1024 * 1024))?.toFixed(1)} MB
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-border">
                    <Button
                      variant="default"
                      onClick={() => onDownload(content)}
                      iconName="Download"
                      iconPosition="left"
                    >
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => onBookmark(content)}
                      iconName={content?.isBookmarked ? "Bookmark" : "BookmarkPlus"}
                      iconPosition="left"
                    >
                      {content?.isBookmarked ? "Bookmarked" : "Bookmark"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-80 border-l border-border flex flex-col">
              {/* Tabs */}
              <div className="flex border-b border-border">
                <button
                  onClick={() => setShowChapters(true)}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    showChapters
                      ? 'text-primary border-b-2 border-primary' :'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Chapters
                </button>
                <button
                  onClick={() => setShowChapters(false)}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    !showChapters
                      ? 'text-primary border-b-2 border-primary' :'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Notes ({notes?.length})
                </button>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto">
                {showChapters ? (
                  <div className="p-4 space-y-2">
                    {content?.chapters?.map((chapter, index) => (
                      <button
                        key={index}
                        onClick={() => jumpToChapter(chapter?.timestamp)}
                        className="w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-foreground text-sm">
                            {chapter?.title}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(chapter?.timestamp)}
                          </span>
                        </div>
                        {chapter?.description && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {chapter?.description}
                          </p>
                        )}
                      </button>
                    )) || (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        No chapters available
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="p-4">
                    {/* Add Note */}
                    <div className="space-y-2 mb-4">
                      <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e?.target?.value)}
                        placeholder="Add a note at current time..."
                        className="w-full p-3 text-sm border border-border rounded-lg resize-none"
                        rows={3}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAddNote}
                        disabled={!newNote?.trim()}
                        iconName="Plus"
                        iconPosition="left"
                        iconSize={12}
                      >
                        Add Note
                      </Button>
                    </div>

                    {/* Notes List */}
                    <div className="space-y-3">
                      {notes?.map((note) => (
                        <div key={note?.id} className="p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <button
                              onClick={() => jumpToChapter(note?.timestamp)}
                              className="text-xs text-primary hover:underline"
                            >
                              {formatTime(note?.timestamp)}
                            </button>
                            <span className="text-xs text-muted-foreground">
                              {new Date(note.createdAt)?.toLocaleDateString('en-IN')}
                            </span>
                          </div>
                          <p className="text-sm text-foreground">{note?.text}</p>
                        </div>
                      ))}
                      {notes?.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-8">
                          No notes yet. Add notes while listening to remember key points.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentPreview;