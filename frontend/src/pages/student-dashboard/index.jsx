import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RoleAdaptiveHeader from '../../components/ui/RoleAdaptiveHeader';
import ProgressContextBar from '../../components/ui/ProgressContextBar';
import OfflineContentManager from '../../components/ui/OfflineContentManager';
import UpcomingSessionCard from './components/UpcomingSessionCard';
import RecordedLectureCard from './components/RecordedLectureCard';
import DataUsageMonitor from './components/DataUsageMonitor';
import QuickAccessCard from './components/QuickAccessCard';
import ConnectionStatusBanner from './components/ConnectionStatusBanner';
import NotificationCenter from './components/NotificationCenter';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../utils/api';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user: authUser, token } = useAuth();
  const [connectionQuality, setConnectionQuality] = useState('good');
  const [isOfflineManagerOpen, setIsOfflineManagerOpen] = useState(false);
  const [currentMode, setCurrentMode] = useState('auto');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for dashboard data
  const [user, setUser] = useState(null);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [recordedLectures, setRecordedLectures] = useState([]);
  
  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) {
        navigate('/login');
        return;
      }
      
      try {
        setLoading(true);
        const response = await api.get(`/dashboard/student?token=${token}`);
        
        if (response.data && response.data.success) {
          const { user: userData, upcomingSessions: sessions, recordedLectures: lectures } = response.data.data;
          
          setUser(userData);
          setUpcomingSessions(sessions || []);
          setRecordedLectures(lectures || []);
        } else {
          setError('Failed to fetch dashboard data');
          // Set user data from auth context as fallback
          setUser(authUser);
          setUpcomingSessions([]);
          setRecordedLectures([]);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Error connecting to server');
        
        // Use authenticated user data as fallback
        setUser({
          name: authUser?.name,
          role: "student",
          id: authUser?.id,
          course: "Electronics Engineering",
          semester: "Current Semester"
        });
        
        // Set empty arrays instead of mock data
        setUpcomingSessions([]);
        setRecordedLectures([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [token, navigate, authUser]);

  // Real data usage information (initialized with empty values)
  const dataUsage = {
    daily: {
      total: 0,
      liveStreaming: 0,
      downloads: 0,
      other: 0
    },
    monthly: {
      total: 0,
      liveStreaming: 0,
      downloads: 0,
      other: 0
    }
  };

  const dataLimit = {
    daily: 200 * 1024 * 1024,
    monthly: 5 * 1024 * 1024 * 1024
  };

  // Function to create and share a new video conference
  const handleCreateConference = () => {
    // Generate a unique room ID
    const roomId = `vidyalink-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Create a shareable link
    const shareableLink = `${window.location.origin}/join-conference?roomId=${roomId}`;
    
    // Copy link to clipboard
    navigator.clipboard.writeText(shareableLink)
      .then(() => {
        alert('Conference link copied to clipboard! Share this with others to join.');
      })
      .catch(err => {
        console.error('Failed to copy link:', err);
        alert(`Share this link with others: ${shareableLink}`);
      });
    
    // Navigate to the video conference
    navigate('/video-conference', { state: { roomId, title: 'My Conference' } });
  };
  
  // Notifications data
  const [notifications, setNotifications] = useState([]);  // Empty array instead of dummy data
  
  /* Removed dummy notifications data */
  
  // Function to fetch notifications from API
  useEffect(() => {
    // This would be replaced with an actual API call in production
    // For now, we'll leave it empty to show real-time data only
  }, []);
  
  // Notification handlers
  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };
  
  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  // Mock quick access data
  const quickAccessItems = [
    {
      title: "Discussion Board",
      description: "Join conversations with peers and instructors",
      icon: "MessageSquare",
      route: "/discussion-board",
      badge: "3",
      color: "primary"
    },
    {
      title: "Downloadable Materials",
      description: "Access study materials for offline learning",
      icon: "Download",
      route: "/content-library",
      color: "secondary"
    },
    {
      title: "Video Conference",
      description: "Start or join a video call",
      icon: "PhoneCall",
      route: "/video-conference",
      color: "info"
    },
    {
      title: "Quiz Center",
      description: "Complete interactive quizzes and assessments",
      icon: "Brain",
      route: "/quiz-center",
      badge: "2",
      color: "success"
    },
    {
      title: "Progress Tracker",
      description: "Monitor your learning progress and achievements",
      icon: "TrendingUp",
      route: "/progress-tracker",
      color: "warning"
    }
  ];

  // Mock offline content
  const availableContent = [
    {
      id: "content_001",
      title: "AI Fundamentals - Complete Course",
      type: "Video Course",
      size: 1.2 * 1024 * 1024 * 1024
    },
    {
      id: "content_002",
      title: "VLSI Design Handbook",
      type: "PDF Document",
      size: 45 * 1024 * 1024
    }
  ];

  const downloadedContent = [
    {
      id: "downloaded_001",
      title: "Introduction to Artificial Intelligence",
      size: 450 * 1024 * 1024
    }
  ];

  // Mock learning milestones
  const learningMilestones = [
    { id: 1, title: "Complete AI Basics", completed: true },
    { id: 2, title: "VLSI Lab Assignment", completed: true },
    { id: 3, title: "Renewable Energy Quiz", completed: false },
    { id: 4, title: "Final Project Submission", completed: false }
  ];

  // Simulate connection quality changes
  useEffect(() => {
    const qualities = ['good', 'fair', 'poor', 'good'];
    let index = 0;
    
    const interval = setInterval(() => {
      setConnectionQuality(qualities?.[index]);
      index = (index + 1) % qualities?.length;
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleJoinSession = (sessionId) => {
    // Generate a unique room ID based on the session ID
    const roomId = `session-${sessionId}`;
    navigate('/video-conference', { state: { roomId, title: `Live Session ${sessionId}` } });
  };

  const handlePlayLecture = (lectureId) => {
    navigate('/session-recording-player', { state: { lectureId } });
  };

  const handleDownloadLecture = (lectureId) => {
    console.log('Starting download for lecture:', lectureId);
    // Simulate download progress
  };

  const handleModeChange = (mode) => {
    setCurrentMode(mode);
    console.log('Mode changed to:', mode);
  };

  return (
    <div className="min-h-screen bg-background">
      <RoleAdaptiveHeader 
        user={user}
        onNavigate={(path) => navigate(path)}
      />
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Connection Status Banner */}
        <ConnectionStatusBanner 
          connectionQuality={connectionQuality}
          onModeChange={handleModeChange}
        />

        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Welcome back, {user?.name}
              </h1>
              <p className="text-muted-foreground">
                {user?.course} • {user?.semester}
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="primary"
                iconName="Video"
                iconPosition="left"
                onClick={handleCreateConference}
              >
                New Conference
              </Button>
              
              <Button
                variant="outline"
                iconName="Download"
                iconPosition="left"
                onClick={() => setIsOfflineManagerOpen(true)}
              >
                Offline Content
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Sessions */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Icon name="Calendar" size={20} className="text-primary" />
                  Live Sessions
                </h2>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>
              
              <div className="space-y-4">
                {upcomingSessions?.map((session) => (
                  <UpcomingSessionCard
                    key={session?.id}
                    session={session}
                    onJoinSession={handleJoinSession}
                  />
                ))}
              </div>
            </section>

            {/* Recent Lectures */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Icon name="Play" size={20} className="text-secondary" />
                  Recent Lectures
                </h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/content-library')}
                >
                  Browse All
                </Button>
              </div>
              
              <div className="space-y-4">
                {recordedLectures?.map((lecture) => (
                  <RecordedLectureCard
                    key={lecture?.id}
                    lecture={lecture}
                    onPlayLecture={handlePlayLecture}
                    onDownloadLecture={handleDownloadLecture}
                  />
                ))}
              </div>
            </section>

            {/* Quick Access Grid */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Icon name="Zap" size={20} className="text-accent" />
                Quick Access
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickAccessItems?.map((item, index) => (
                  <QuickAccessCard
                    key={index}
                    title={item?.title}
                    description={item?.description}
                    icon={item?.icon}
                    route={item?.route}
                    badge={item?.badge}
                    color={item?.color}
                  />
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Data Usage Monitor */}
            <DataUsageMonitor
              dailyUsage={dataUsage?.daily}
              monthlyUsage={dataUsage?.monthly}
              dataLimit={dataLimit}
            />

            {/* Notifications */}
            <NotificationCenter
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
            />

            {/* Study Stats */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Icon name="BarChart3" size={18} className="text-success" />
                This Week's Progress
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Sessions Attended</span>
                  <span className="font-semibold text-foreground">8/10</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-success h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Assignments Completed</span>
                  <span className="font-semibold text-foreground">3/4</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-warning h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Quiz Score Average</span>
                  <span className="font-semibold text-foreground">85%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Progress Context Bar */}
      <ProgressContextBar
        sessionProgress={45}
        downloadProgress={{
          'Digital Signal Processing Basics.mp4': 65,
          'AI Fundamentals - Chapter 3.pdf': 30
        }}
        learningMilestones={learningMilestones}
      />
      {/* Offline Content Manager */}
      <OfflineContentManager
        isOpen={isOfflineManagerOpen}
        onClose={() => setIsOfflineManagerOpen(false)}
        availableContent={availableContent}
        downloadedContent={downloadedContent}
      />
    </div>
  );
};

export default StudentDashboard;
