import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const TranscriptPanel = ({ 
  transcript = [], 
  currentTime, 
  onSeekTo, 
  isCollapsed, 
  onToggleCollapse,
  className = '' 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const transcriptRef = useRef(null);
  const activeSegmentRef = useRef(null);

  // Mock transcript data
  const mockTranscript = transcript?.length > 0 ? transcript : [
    {
      id: 1,
      startTime: 0,
      endTime: 15,
      speaker: "Dr. Sarah Chen",
      text: "Welcome to today's session on Advanced VLSI Design Principles. In this lecture, we'll explore the fundamental concepts of semiconductor device physics and their applications in modern integrated circuits."
    },
    {
      id: 2,
      startTime: 15,
      endTime: 45,
      speaker: "Dr. Sarah Chen",
      text: "Let's begin with the basic structure of a MOSFET transistor. The Metal-Oxide-Semiconductor Field-Effect Transistor is the building block of all digital circuits we use today."
    },
    {
      id: 3,
      startTime: 45,
      endTime: 78,
      speaker: "Dr. Sarah Chen",
      text: "The key parameters we need to understand are threshold voltage, channel length modulation, and subthreshold conduction. These factors directly impact the performance and power consumption of our designs."
    },
    {
      id: 4,
      startTime: 78,
      endTime: 120,
      speaker: "Dr. Sarah Chen",
      text: "Now, let's discuss the scaling trends in semiconductor technology. Moore's Law has driven the industry for decades, but we're now facing physical limitations that require innovative solutions."
    },
    {
      id: 5,
      startTime: 120,
      endTime: 165,
      speaker: "Dr. Sarah Chen",
      text: "Process variations become increasingly significant as we scale down. Statistical design methodologies and corner analysis are essential tools for robust circuit design in advanced technology nodes."
    },
    {
      id: 6,
      startTime: 165,
      endTime: 210,
      speaker: "Dr. Sarah Chen",
      text: "Power consumption is another critical concern. We have three main components: dynamic power, static power, and short-circuit power. Each requires different optimization strategies."
    },
    {
      id: 7,
      startTime: 210,
      endTime: 255,
      speaker: "Dr. Sarah Chen",
      text: "Let's examine some practical design techniques. Clock gating, power gating, and voltage scaling are commonly used methods to reduce power consumption in digital systems."
    },
    {
      id: 8,
      startTime: 255,
      endTime: 300,
      speaker: "Dr. Sarah Chen",
      text: "In the next segment, we'll dive into layout considerations and the impact of parasitic effects on circuit performance. This is where theory meets practical implementation."
    }
  ];

  useEffect(() => {
    if (searchQuery?.trim()) {
      setIsSearching(true);
      const results = mockTranscript?.filter(segment =>
        segment?.text?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        segment?.speaker?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      )?.map(segment => ({
        ...segment,
        highlightedText: segment?.text?.replace(
          new RegExp(searchQuery, 'gi'),
          `<mark class="bg-yellow-200 text-yellow-900 px-1 rounded">$&</mark>`
        )
      }));
      setSearchResults(results);
      setCurrentSearchIndex(results?.length > 0 ? 0 : -1);
      setIsSearching(false);
    } else {
      setSearchResults([]);
      setCurrentSearchIndex(-1);
    }
  }, [searchQuery]);

  useEffect(() => {
    // Auto-scroll to active segment
    if (activeSegmentRef?.current) {
      activeSegmentRef?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [currentTime]);

  const getCurrentSegment = () => {
    return mockTranscript?.find(segment => 
      currentTime >= segment?.startTime && currentTime <= segment?.endTime
    );
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const handleSegmentClick = (startTime) => {
    onSeekTo(startTime);
  };

  const navigateSearch = (direction) => {
    if (searchResults?.length === 0) return;
    
    let newIndex = currentSearchIndex;
    if (direction === 'next') {
      newIndex = (currentSearchIndex + 1) % searchResults?.length;
    } else {
      newIndex = currentSearchIndex === 0 ? searchResults?.length - 1 : currentSearchIndex - 1;
    }
    setCurrentSearchIndex(newIndex);
    
    if (searchResults?.[newIndex]) {
      onSeekTo(searchResults?.[newIndex]?.startTime);
    }
  };

  const currentSegment = getCurrentSegment();
  const displayTranscript = searchQuery ? searchResults : mockTranscript;

  if (isCollapsed) {
    return (
      <div className={`bg-card border border-border rounded-lg ${className}`}>
        <Button
          variant="ghost"
          onClick={onToggleCollapse}
          className="w-full p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Icon name="FileText" size={20} />
            <span className="font-medium">Transcript</span>
          </div>
          <Icon name="ChevronUp" size={20} />
        </Button>
      </div>
    );
  }

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Icon name="FileText" size={20} className="text-primary" />
          <h3 className="font-semibold text-foreground">Transcript</h3>
          {searchResults?.length > 0 && (
            <span className="text-sm text-muted-foreground">
              ({searchResults?.length} results)
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
        >
          <Icon name="ChevronDown" size={20} />
        </Button>
      </div>
      {/* Search */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Input
            type="search"
            placeholder="Search transcript..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            className="pr-20"
          />
          {searchQuery && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {isSearching ? (
                <Icon name="Loader2" size={16} className="animate-spin text-muted-foreground" />
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigateSearch('prev')}
                    disabled={searchResults?.length === 0}
                    className="h-6 w-6"
                  >
                    <Icon name="ChevronUp" size={12} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigateSearch('next')}
                    disabled={searchResults?.length === 0}
                    className="h-6 w-6"
                  >
                    <Icon name="ChevronDown" size={12} />
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Transcript Content */}
      <div 
        ref={transcriptRef}
        className="max-h-96 overflow-y-auto p-4 space-y-4"
      >
        {displayTranscript?.map((segment, index) => {
          const isActive = currentSegment?.id === segment?.id;
          const isSearchResult = searchQuery && searchResults?.some(result => result?.id === segment?.id);
          const isCurrentSearchResult = searchResults?.[currentSearchIndex]?.id === segment?.id;
          
          return (
            <div
              key={segment?.id}
              ref={isActive ? activeSegmentRef : null}
              className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                isActive 
                  ? 'bg-primary/10 border-l-4 border-primary' 
                  : isCurrentSearchResult
                  ? 'bg-yellow-50 border-l-4 border-yellow-400'
                  : isSearchResult
                  ? 'bg-yellow-50/50' :'hover:bg-muted/50'
              }`}
              onClick={() => handleSegmentClick(segment?.startTime)}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <span className={`text-sm font-mono px-2 py-1 rounded ${
                    isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {formatTime(segment?.startTime)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-foreground">
                      {segment?.speaker}
                    </span>
                    {isActive && (
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        <span className="text-xs text-primary font-medium">Playing</span>
                      </div>
                    )}
                  </div>
                  <p 
                    className="text-sm text-muted-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: searchQuery && segment?.highlightedText ? segment?.highlightedText : segment?.text 
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}

        {displayTranscript?.length === 0 && searchQuery && (
          <div className="text-center py-8">
            <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
          </div>
        )}
      </div>
      {/* Footer */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{mockTranscript?.length} segments</span>
          <div className="flex items-center gap-4">
            <span>Auto-scroll enabled</span>
            <Button variant="ghost" size="sm" className="text-xs">
              Download Transcript
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranscriptPanel;