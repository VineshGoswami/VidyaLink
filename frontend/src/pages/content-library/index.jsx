import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import RoleAdaptiveHeader from '../../components/ui/RoleAdaptiveHeader';
import ProgressContextBar from '../../components/ui/ProgressContextBar';
import OfflineContentManager from '../../components/ui/OfflineContentManager';
import ContentCard from './components/ContentCard';
import FilterPanel from './components/FilterPanel';
import DownloadManager from './components/DownloadManager';
import PersonalLibrary from './components/PersonalLibrary';
import ContentPreview from './components/ContentPreview';

const ContentLibrary = () => {
  const navigate = useNavigate();
  const [user] = useState({ role: 'student', name: 'Priya Sharma' });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isOfflineManagerOpen, setIsOfflineManagerOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('browse');
  const [downloads, setDownloads] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    subject: 'all',
    educator: 'all',
    fileSize: 'all',
    dateRange: { start: '', end: '' },
    sortBy: 'newest',
    showDownloadedOnly: false,
    showBookmarkedOnly: false
  });

  // Mock data for available content
  const [availableContent] = useState([
    {
      id: 1,
      title: "Introduction to Machine Learning Algorithms",
      educator: "Dr. Rajesh Kumar",
      subject: "Artificial Intelligence",
      duration: 3600, // 1 hour
      fileSize: 180 * 1024 * 1024, // 180MB
      thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=225&fit=crop",
      uploadDate: "2024-01-15",
      description: `This comprehensive lecture covers the fundamental concepts of machine learning algorithms including supervised and unsupervised learning techniques.\n\nTopics covered:\n• Linear and logistic regression\n• Decision trees and random forests\n• Support vector machines\n• Clustering algorithms\n• Neural network basics`,
      audioPreviewUrl: "/audio/ml-intro-preview.mp3",
      isBookmarked: false,
      chapters: [
        { title: "Introduction to ML", timestamp: 0, description: "Overview of machine learning concepts" },
        { title: "Supervised Learning", timestamp: 600, description: "Classification and regression techniques" },
        { title: "Unsupervised Learning", timestamp: 1800, description: "Clustering and dimensionality reduction" },
        { title: "Neural Networks", timestamp: 2700, description: "Basic neural network architecture" }
      ]
    },
    {
      id: 2,
      title: "VLSI Design Fundamentals and CMOS Technology",
      educator: "Prof. Anita Sharma",
      subject: "VLSI Design",
      duration: 2700, // 45 minutes
      fileSize: 120 * 1024 * 1024, // 120MB
      thumbnail: "https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?w=400&h=225&fit=crop",
      uploadDate: "2024-01-12",
      description: `Deep dive into VLSI design principles focusing on CMOS technology and fabrication processes.\n\nKey learning outcomes:\n• Understanding CMOS transistor operation\n• Layout design principles\n• Process variations and their impact\n• Power consumption analysis`,
      audioPreviewUrl: "/audio/vlsi-fundamentals-preview.mp3",
      isBookmarked: true,
      chapters: [
        { title: "VLSI Overview", timestamp: 0, description: "Introduction to VLSI design flow" },
        { title: "CMOS Technology", timestamp: 900, description: "CMOS transistor fundamentals" },
        { title: "Layout Design", timestamp: 1800, description: "Physical design considerations" }
      ]
    },
    {
      id: 3,
      title: "Solar Energy Systems and Grid Integration",
      educator: "Dr. Vikram Singh",
      subject: "Renewable Energy",
      duration: 4200, // 70 minutes
      fileSize: 250 * 1024 * 1024, // 250MB
      thumbnail: "https://images.pixabay.com/photo/2017/09/12/13/21/photovoltaic-system-2742302_1280.jpg?w=400&h=225&fit=crop",
      uploadDate: "2024-01-10",
      description: `Comprehensive coverage of solar photovoltaic systems, from basic principles to grid integration challenges.\n\nCourse content:\n• Solar cell physics and characteristics\n• PV system components and design\n• Grid-tied vs off-grid systems\n• Power electronics for solar applications\n• Energy storage integration`,
      audioPreviewUrl: "/audio/solar-energy-preview.mp3",
      isBookmarked: false,
      chapters: [
        { title: "Solar Cell Physics", timestamp: 0, description: "Photovoltaic effect and cell characteristics" },
        { title: "System Components", timestamp: 1200, description: "Inverters, controllers, and monitoring" },
        { title: "Grid Integration", timestamp: 2400, description: "Synchronization and power quality" },
        { title: "Energy Storage", timestamp: 3600, description: "Battery systems and management" }
      ]
    },
    {
      id: 4,
      title: "Embedded Systems Programming with ARM Cortex",
      educator: "Prof. Meera Patel",
      subject: "Embedded Systems",
      duration: 3300, // 55 minutes
      fileSize: 160 * 1024 * 1024, // 160MB
      thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=225&fit=crop",
      uploadDate: "2024-01-08",
      description: `Hands-on approach to embedded systems programming using ARM Cortex-M microcontrollers.\n\nPractical topics:\n• ARM Cortex-M architecture\n• GPIO and peripheral interfacing\n• Interrupt handling and timers\n• Communication protocols (UART, SPI, I2C)\n• Real-time operating systems basics`,
      audioPreviewUrl: "/audio/embedded-arm-preview.mp3",
      isBookmarked: true,
      chapters: [
        { title: "ARM Architecture", timestamp: 0, description: "Cortex-M processor overview" },
        { title: "GPIO Programming", timestamp: 800, description: "Digital I/O and peripheral control" },
        { title: "Interrupts & Timers", timestamp: 1600, description: "Event-driven programming" },
        { title: "Communication", timestamp: 2400, description: "Serial communication protocols" }
      ]
    },
    {
      id: 5,
      title: "Digital Signal Processing Applications",
      educator: "Dr. Suresh Reddy",
      subject: "Digital Signal Processing",
      duration: 3900, // 65 minutes
      fileSize: 200 * 1024 * 1024, // 200MB
      thumbnail: "https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?w=400&h=225&fit=crop",
      uploadDate: "2024-01-05",
      description: `Advanced DSP concepts with practical applications in audio, image, and communication systems.\n\nTopics include:\n• Discrete Fourier Transform (DFT) and FFT\n• Digital filter design and implementation\n• Sampling theory and aliasing\n• Spectral analysis techniques\n• DSP processor architectures`,
      audioPreviewUrl: "/audio/dsp-applications-preview.mp3",
      isBookmarked: false,
      chapters: [
        { title: "DFT and FFT", timestamp: 0, description: "Frequency domain analysis" },
        { title: "Digital Filters", timestamp: 1300, description: "FIR and IIR filter design" },
        { title: "Sampling Theory", timestamp: 2600, description: "Nyquist criterion and anti-aliasing" },
        { title: "DSP Processors", timestamp: 3200, description: "Hardware implementation" }
      ]
    },
    {
      id: 6,
      title: "Power Electronics for Renewable Energy",
      educator: "Dr. Rajesh Kumar",
      subject: "Power Electronics",
      duration: 4500, // 75 minutes
      fileSize: 280 * 1024 * 1024, // 280MB
      thumbnail: "https://images.pixabay.com/photo/2016/11/19/15/32/laptop-1839876_1280.jpg?w=400&h=225&fit=crop",
      uploadDate: "2024-01-03",
      description: `Specialized course on power electronic converters used in renewable energy systems.\n\nKey areas:\n• DC-DC converter topologies\n• Inverter design and control\n• Maximum power point tracking (MPPT)\n• Grid synchronization techniques\n• Power quality and harmonics`,
      audioPreviewUrl: "/audio/power-electronics-preview.mp3",
      isBookmarked: true,
      chapters: [
        { title: "DC-DC Converters", timestamp: 0, description: "Buck, boost, and buck-boost converters" },
        { title: "Inverter Design", timestamp: 1500, description: "Single and three-phase inverters" },
        { title: "MPPT Algorithms", timestamp: 3000, description: "Perturb & observe, incremental conductance" },
        { title: "Grid Synchronization", timestamp: 3900, description: "Phase-locked loops and control" }
      ]
    }
  ]);

  // Mock downloaded content
  const [downloadedContent] = useState([
    {
      id: 1,
      title: "Introduction to Machine Learning Algorithms",
      educator: "Dr. Rajesh Kumar",
      subject: "Artificial Intelligence",
      duration: 3600,
      fileSize: 180 * 1024 * 1024,
      thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=225&fit=crop",
      downloadDate: "2024-01-16",
      syncStatus: 'synced'
    },
    {
      id: 2,
      title: "VLSI Design Fundamentals and CMOS Technology",
      educator: "Prof. Anita Sharma",
      subject: "VLSI Design",
      duration: 2700,
      fileSize: 120 * 1024 * 1024,
      thumbnail: "https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?w=400&h=225&fit=crop",
      downloadDate: "2024-01-14",
      syncStatus: 'pending'
    }
  ]);

  const handleDownload = (content, quality = 'standard') => {
    const qualityMultiplier = quality === 'low' ? 0.3 : quality === 'standard' ? 0.6 : 1;
    const adjustedSize = content?.fileSize * qualityMultiplier;
    
    const newDownload = {
      id: content?.id,
      title: content?.title,
      progress: 0,
      status: 'downloading',
      totalSize: adjustedSize,
      downloadedSize: 0,
      speed: Math.random() * 2000000 + 500000, // 0.5-2.5 MB/s
      timeRemaining: adjustedSize / (Math.random() * 2000000 + 500000),
      quality
    };

    setDownloads(prev => [...prev, newDownload]);

    // Simulate download progress
    const interval = setInterval(() => {
      setDownloads(prev => prev?.map(download => {
        if (download?.id === content?.id && download?.progress < 100) {
          const increment = Math.random() * 10 + 5;
          const newProgress = Math.min(download?.progress + increment, 100);
          const newDownloadedSize = (newProgress / 100) * download?.totalSize;
          const newTimeRemaining = newProgress < 100 ? 
            (download?.totalSize - newDownloadedSize) / download?.speed : 0;
          
          return {
            ...download,
            progress: newProgress,
            downloadedSize: newDownloadedSize,
            timeRemaining: newTimeRemaining,
            status: newProgress === 100 ? 'completed' : 'downloading'
          };
        }
        return download;
      }));
    }, 1000);

    setTimeout(() => clearInterval(interval), 15000);
  };

  const handlePreview = (content) => {
    setSelectedContent(content);
    setIsPreviewOpen(true);
  };

  const handleBookmark = (content) => {
    // Toggle bookmark status
    console.log('Toggling bookmark for:', content?.title);
  };

  const handlePauseDownload = (downloadId) => {
    setDownloads(prev => prev?.map(download => 
      download?.id === downloadId 
        ? { ...download, status: 'paused' }
        : download
    ));
  };

  const handleResumeDownload = (downloadId) => {
    setDownloads(prev => prev?.map(download => 
      download?.id === downloadId 
        ? { ...download, status: 'downloading' }
        : download
    ));
  };

  const handleCancelDownload = (downloadId) => {
    setDownloads(prev => prev?.filter(download => download?.id !== downloadId));
  };

  const handleScheduleDownload = () => {
    console.log('Opening download scheduler');
  };

  const handlePlayContent = (content) => {
    navigate('/session-recording-player', { state: { content } });
  };

  const handleRemoveContent = (contentId) => {
    console.log('Removing content:', contentId);
  };

  const handleSyncContent = () => {
    console.log('Syncing offline content');
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      subject: 'all',
      educator: 'all',
      fileSize: 'all',
      dateRange: { start: '', end: '' },
      sortBy: 'newest',
      showDownloadedOnly: false,
      showBookmarkedOnly: false
    });
  };

  const getFilteredContent = () => {
    let filtered = [...availableContent];

    // Apply search filter
    if (filters?.search) {
      filtered = filtered?.filter(content => 
        content?.title?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
        content?.educator?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
        content?.subject?.toLowerCase()?.includes(filters?.search?.toLowerCase())
      );
    }

    // Apply subject filter
    if (filters?.subject !== 'all') {
      filtered = filtered?.filter(content => 
        content?.subject?.toLowerCase()?.replace(/\s+/g, '-') === filters?.subject
      );
    }

    // Apply educator filter
    if (filters?.educator !== 'all') {
      filtered = filtered?.filter(content => 
        content?.educator?.toLowerCase()?.replace(/\s+/g, '-') === filters?.educator
      );
    }

    // Apply file size filter
    if (filters?.fileSize !== 'all') {
      filtered = filtered?.filter(content => {
        const sizeMB = content?.fileSize / (1024 * 1024);
        switch (filters?.fileSize) {
          case 'small': return sizeMB < 50;
          case 'medium': return sizeMB >= 50 && sizeMB <= 200;
          case 'large': return sizeMB > 200;
          default: return true;
        }
      });
    }

    // Apply date range filter
    if (filters?.dateRange?.start || filters?.dateRange?.end) {
      filtered = filtered?.filter(content => {
        const contentDate = new Date(content.uploadDate);
        const startDate = filters?.dateRange?.start ? new Date(filters.dateRange.start) : null;
        const endDate = filters?.dateRange?.end ? new Date(filters.dateRange.end) : null;
        
        if (startDate && contentDate < startDate) return false;
        if (endDate && contentDate > endDate) return false;
        return true;
      });
    }

    // Apply bookmark filter
    if (filters?.showBookmarkedOnly) {
      filtered = filtered?.filter(content => content?.isBookmarked);
    }

    // Apply downloaded filter
    if (filters?.showDownloadedOnly) {
      const downloadedIds = downloadedContent?.map(d => d?.id);
      filtered = filtered?.filter(content => downloadedIds?.includes(content?.id));
    }

    // Apply sorting
    switch (filters?.sortBy) {
      case 'newest':
        filtered?.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
        break;
      case 'oldest':
        filtered?.sort((a, b) => new Date(a.uploadDate) - new Date(b.uploadDate));
        break;
      case 'title':
        filtered?.sort((a, b) => a?.title?.localeCompare(b?.title));
        break;
      case 'duration':
        filtered?.sort((a, b) => b?.duration - a?.duration);
        break;
      case 'size':
        filtered?.sort((a, b) => b?.fileSize - a?.fileSize);
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredContent = getFilteredContent();

  return (
    <div className="min-h-screen bg-background">
      <RoleAdaptiveHeader 
        user={user}
        onNavigate={(path) => navigate(path)}
      />
      <div className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Content Library</h1>
            <p className="text-muted-foreground">
              Access recorded lectures, downloadable materials, and offline-capable educational resources
            </p>
          </div>
          <div className="flex items-center gap-2 mt-4 lg:mt-0">
            <Button
              variant="outline"
              onClick={() => setIsOfflineManagerOpen(true)}
              iconName="Download"
              iconPosition="left"
            >
              Offline Manager
            </Button>
            <Button
              variant="ghost"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="lg:hidden"
              iconName="Filter"
            >
              Filters
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-border mb-6">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'browse' ?'text-primary border-b-2 border-primary' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            Browse Content ({filteredContent?.length})
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'library' ?'text-primary border-b-2 border-primary' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            My Library ({downloadedContent?.length})
          </button>
        </div>

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Sidebar - Filters */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <FilterPanel
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              isOpen={true}
              onToggle={() => {}}
            />
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {activeTab === 'browse' ? (
              <div className="space-y-6">
                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredContent?.map((content) => {
                    const downloadProgress = downloads?.find(d => d?.id === content?.id)?.progress;
                    const isDownloaded = downloadedContent?.some(d => d?.id === content?.id);
                    
                    return (
                      <ContentCard
                        key={content?.id}
                        content={content}
                        onDownload={handleDownload}
                        onPreview={handlePreview}
                        onBookmark={handleBookmark}
                        isDownloaded={isDownloaded}
                        downloadProgress={downloadProgress}
                      />
                    );
                  })}
                </div>

                {filteredContent?.length === 0 && (
                  <div className="text-center py-12">
                    <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">No content found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your filters or search terms
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <PersonalLibrary
                downloadedContent={downloadedContent}
                onPlayContent={handlePlayContent}
                onRemoveContent={handleRemoveContent}
                onSyncContent={handleSyncContent}
              />
            )}
          </div>
        </div>

        {/* Download Manager */}
        {downloads?.length > 0 && (
          <div className="mt-6">
            <DownloadManager
              downloads={downloads}
              onPauseDownload={handlePauseDownload}
              onResumeDownload={handleResumeDownload}
              onCancelDownload={handleCancelDownload}
              onScheduleDownload={handleScheduleDownload}
            />
          </div>
        )}
      </div>
      {/* Mobile Filter Panel */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-80 max-w-full">
            <FilterPanel
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              isOpen={isFilterOpen}
              onToggle={() => setIsFilterOpen(false)}
            />
          </div>
        </div>
      )}
      {/* Content Preview Modal */}
      <ContentPreview
        content={selectedContent}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onDownload={handleDownload}
        onBookmark={handleBookmark}
        onAddNote={(note) => console.log('Adding note:', note)}
      />
      {/* Offline Content Manager */}
      <OfflineContentManager
        isOpen={isOfflineManagerOpen}
        onClose={() => setIsOfflineManagerOpen(false)}
        availableContent={availableContent}
        downloadedContent={downloadedContent}
      />
      {/* Progress Context Bar */}
      <ProgressContextBar
        position="bottom"
        sessionProgress={0}
        downloadProgress={downloads?.reduce((acc, download) => {
          if (download?.status === 'downloading' || download?.status === 'paused') {
            acc[download.title] = download?.progress;
          }
          return acc;
        }, {})}
        learningMilestones={[]}
      />
    </div>
  );
};

export default ContentLibrary;