import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ChapterNavigation = ({ 
  chapters = [], 
  currentTime, 
  onChapterSelect, 
  className = '' 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Mock chapters data
  const mockChapters = chapters?.length > 0 ? chapters : [
    {
      id: 1,
      title: "Introduction to VLSI Design",
      startTime: 0,
      duration: 180,
      description: "Overview of semiconductor technology and design principles",
      completed: true
    },
    {
      id: 2,
      title: "MOSFET Fundamentals",
      startTime: 180,
      duration: 240,
      description: "Understanding transistor physics and characteristics",
      completed: true
    },
    {
      id: 3,
      title: "Scaling and Process Variations",
      startTime: 420,
      duration: 200,
      description: "Moore's Law limitations and statistical design methods",
      completed: false
    },
    {
      id: 4,
      title: "Power Optimization Techniques",
      startTime: 620,
      duration: 220,
      description: "Dynamic, static, and short-circuit power management",
      completed: false
    },
    {
      id: 5,
      title: "Layout and Parasitic Effects",
      startTime: 840,
      duration: 180,
      description: "Physical design considerations and performance impact",
      completed: false
    },
    {
      id: 6,
      title: "Advanced Design Methodologies",
      startTime: 1020,
      duration: 160,
      description: "Modern approaches to robust circuit design",
      completed: false
    }
  ];

  const getCurrentChapter = () => {
    return mockChapters?.find(chapter => 
      currentTime >= chapter?.startTime && 
      currentTime < chapter?.startTime + chapter?.duration
    );
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  const getChapterProgress = (chapter) => {
    if (currentTime < chapter?.startTime) return 0;
    if (currentTime >= chapter?.startTime + chapter?.duration) return 100;
    return ((currentTime - chapter?.startTime) / chapter?.duration) * 100;
  };

  const currentChapter = getCurrentChapter();

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="List" size={20} className="text-primary" />
            <h3 className="font-semibold text-foreground">Chapters</h3>
            <span className="text-sm text-muted-foreground">
              ({mockChapters?.length})
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={20} />
          </Button>
        </div>

        {/* Current Chapter Info */}
        {currentChapter && (
          <div className="mt-3 p-3 bg-primary/10 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-primary">Now Playing</span>
              <span className="text-xs text-muted-foreground">
                Chapter {currentChapter?.id} of {mockChapters?.length}
              </span>
            </div>
            <h4 className="font-medium text-foreground mb-1">{currentChapter?.title}</h4>
            <p className="text-sm text-muted-foreground mb-2">{currentChapter?.description}</p>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${getChapterProgress(currentChapter)}%` }}
              />
            </div>
          </div>
        )}
      </div>
      {/* Chapter List */}
      {isExpanded && (
        <div className="max-h-80 overflow-y-auto">
          {mockChapters?.map((chapter, index) => {
            const isActive = currentChapter?.id === chapter?.id;
            const progress = getChapterProgress(chapter);
            
            return (
              <div
                key={chapter?.id}
                className={`p-4 border-b border-border last:border-b-0 cursor-pointer transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary/5 border-l-4 border-l-primary' :'hover:bg-muted/50'
                }`}
                onClick={() => onChapterSelect(chapter?.startTime)}
              >
                <div className="flex items-start gap-3">
                  {/* Chapter Number */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    chapter?.completed 
                      ? 'bg-success text-success-foreground' 
                      : isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {chapter?.completed ? (
                      <Icon name="Check" size={16} />
                    ) : (
                      chapter?.id
                    )}
                  </div>

                  {/* Chapter Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`font-medium truncate ${
                        isActive ? 'text-primary' : 'text-foreground'
                      }`}>
                        {chapter?.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{formatTime(chapter?.startTime)}</span>
                        <span>•</span>
                        <span>{formatDuration(chapter?.duration)}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {chapter?.description}
                    </p>

                    {/* Progress Bar */}
                    {progress > 0 && (
                      <div className="w-full bg-muted rounded-full h-1">
                        <div 
                          className={`h-1 rounded-full transition-all duration-300 ${
                            chapter?.completed ? 'bg-success' : 'bg-primary'
                          }`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    )}

                    {/* Status Indicators */}
                    <div className="flex items-center gap-2 mt-2">
                      {chapter?.completed && (
                        <span className="inline-flex items-center gap-1 text-xs text-success">
                          <Icon name="CheckCircle" size={12} />
                          Completed
                        </span>
                      )}
                      {isActive && (
                        <span className="inline-flex items-center gap-1 text-xs text-primary">
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                          Playing
                        </span>
                      )}
                      {!chapter?.completed && !isActive && progress > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Icon name="Clock" size={12} />
                          {Math.round(progress)}% watched
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* Quick Navigation */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const prevChapter = mockChapters?.find((chapter, index) => {
                const currentIndex = mockChapters?.findIndex(c => c?.id === currentChapter?.id);
                return index === currentIndex - 1;
              });
              if (prevChapter) onChapterSelect(prevChapter?.startTime);
            }}
            disabled={!currentChapter || currentChapter?.id === 1}
          >
            <Icon name="ChevronLeft" size={16} />
            Previous
          </Button>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              {currentChapter ? `${currentChapter?.id} of ${mockChapters?.length}` : 'Select chapter'}
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const nextChapter = mockChapters?.find((chapter, index) => {
                const currentIndex = mockChapters?.findIndex(c => c?.id === currentChapter?.id);
                return index === currentIndex + 1;
              });
              if (nextChapter) onChapterSelect(nextChapter?.startTime);
            }}
            disabled={!currentChapter || currentChapter?.id === mockChapters?.length}
          >
            Next
            <Icon name="ChevronRight" size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChapterNavigation;