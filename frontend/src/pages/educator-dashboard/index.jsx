import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RoleAdaptiveHeader from '../../components/ui/RoleAdaptiveHeader';
import ProgressContextBar from '../../components/ui/ProgressContextBar';
import OfflineContentManager from '../../components/ui/OfflineContentManager';
import SessionCard from './components/SessionCard';
import AnalyticsPanel from './components/AnalyticsPanel';
import ContentLibraryWidget from './components/ContentLibraryWidget';
import QuickActions from './components/QuickActions';
import TechnicalStatus from './components/TechnicalStatus';
import UpcomingSchedule from './components/UpcomingSchedule';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../utils/api';

const EducatorDashboard = () => {
  const navigate = useNavigate();
  const { user: authUser, token } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isOfflineManagerOpen, setIsOfflineManagerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for dashboard data
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  
  // Mock analytics data - could be replaced with real data in future
  const analyticsData = {
    totalStudents: 156,
    avgSessionTime: 78,
    completionRate: 89,
    connectionQuality: {
      good: 89,
      fair: 45,
      poor: 22
    }
  };
  
  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) {
        navigate('/login');
        return;
      }
      
      try {
        setLoading(true);
        const response = await api.get(`/dashboard/educator?token=${token}`);
        
        if (response.data && response.data.success) {
          const { user: userData, sessions: sessionData, upcomingSessions: upcomingData } = response.data.data;
          
          setUser(userData);
          setSessions(sessionData || []);
          setUpcomingSessions(upcomingData || []);
        } else {
          setError('Failed to fetch dashboard data');
        }
      } catch (err) {
        console.error('Error fetching educator dashboard data:', err);
        setError('Error connecting to server');
        
        // Fallback to mock data for development/demo purposes
        setUser({
          role: 'educator',
          name: authUser?.name || 'Dr. Priya Sharma',
          email: authUser?.email || 'priya.sharma@vidyant.edu',
          specialization: 'AI & Machine Learning'
        });
        
        // Mock sessions data for fallback
        setSessions([
          {
            id: 1,
            title: 'Introduction to Machine Learning',
            subject: 'AI & ML',
            date: '18/09/2025',
            time: '10:00 AM',
            duration: 90,
            status: 'scheduled',
            enrolledStudents: 24,
            maxStudents: 30,
            connectionQuality: 'good'
          },
          {
            id: 2,
            title: 'Neural Networks Fundamentals',
            subject: 'AI & ML',
            date: '18/09/2025',
            time: '2:00 PM',
            duration: 120,
            status: 'live',
            enrolledStudents: 18,
            maxStudents: 25,
            connectionQuality: 'fair'
          },
          {
            id: 3,
            title: 'Deep Learning Applications',
            subject: 'AI & ML',
            date: '19/09/2025',
            time: '11:00 AM',
            duration: 105,
            status: 'scheduled',
            enrolledStudents: 22,
            maxStudents: 28,
            connectionQuality: 'good'
          }
        ]);
        
        // Mock upcoming sessions for fallback
        setUpcomingSessions([
          {
            id: 4,
            title: 'Computer Vision Basics',
            subject: 'AI & ML',
            dateTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
            enrolledStudents: 20
          },
          {
            id: 5,
            title: 'Natural Language Processing',
            subject: 'AI & ML',
            dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
            enrolledStudents: 15
          },
          {
            id: 6,
            title: 'Reinforcement Learning',
            subject: 'AI & ML',
            dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
            enrolledStudents: 18
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [token, navigate, authUser]);

  // Mock content library data
  const [contentItems] = useState([
    {
      id: 1,
      title: 'ML Algorithms Overview.pdf',
      type: 'pdf',
      size: 2.4 * 1024 * 1024, // 2.4 MB
      optimizationStatus: 'optimized',
      downloads: 156,
      lastAccessed: '2 hours ago'
    },
    {
      id: 2,
      title: 'Neural Network Demo Video',
      type: 'video',
      size: 45.8 * 1024 * 1024, // 45.8 MB
      optimizationStatus: 'processing',
      downloads: 89,
      lastAccessed: '1 day ago'
    },
    {
      id: 3,
      title: 'Python Code Examples',
      type: 'presentation',
      size: 1.2 * 1024 * 1024, // 1.2 MB
      optimizationStatus: 'optimized',
      downloads: 234,
      lastAccessed: '3 hours ago'
    },
    {
      id: 4,
      title: 'Lecture Audio Recording',
      type: 'audio',
      size: 12.5 * 1024 * 1024, // 12.5 MB
      optimizationStatus: 'pending',
      downloads: 67,
      lastAccessed: '5 hours ago'
    }
  ]);

  // Mock offline content
  const availableOfflineContent = [
    { id: 1, title: 'ML Basics Course', type: 'Video Course', size: 250 * 1024 * 1024 },
    { id: 2, title: 'Python Programming Guide', type: 'PDF', size: 15 * 1024 * 1024 },
    { id: 3, title: 'Data Science Toolkit', type: 'Interactive', size: 180 * 1024 * 1024 }
  ];

  const downloadedOfflineContent = [
    { id: 4, title: 'Statistics Fundamentals', type: 'Video', size: 120 * 1024 * 1024 },
    { id: 5, title: 'Algorithm Visualization', type: 'Interactive', size: 85 * 1024 * 1024 }
  ];

  // Event handlers
  const handleStartSession = (sessionId) => {
    navigate('/live-classroom', { state: { sessionId, role: 'educator' } });
  };

  const handleViewSessionDetails = (sessionId) => {
    console.log('Viewing session details:', sessionId);
  };

  const handleCreateSession = () => {
    console.log('Creating new session');
  };

  const handleCreatePoll = () => {
    console.log('Creating new poll');
  };

  const handleViewAnalytics = () => {
    setActiveTab('analytics');
  };

  const handleManageContent = () => {
    navigate('/content-library');
  };

  const handleUploadContent = () => {
    navigate('/content-library', { state: { action: 'upload' } });
  };

  const handleViewLibrary = () => {
    navigate('/content-library');
  };

  const handleJoinSession = (sessionId) => {
    navigate('/live-classroom', { state: { sessionId, role: 'educator' } });
  };

  const handleReschedule = (sessionId) => {
    console.log('Rescheduling session:', sessionId);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Home' },
    { id: 'sessions', label: 'Sessions', icon: 'Video' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' },
    { id: 'content', label: 'Content', icon: 'FolderOpen' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <RoleAdaptiveHeader 
        user={user} 
        onNavigate={handleNavigation}
      />
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Welcome back, {user?.name?.split(' ')?.[1]}! 👋
              </h1>
              <p className="text-muted-foreground">
                Ready to inspire minds? Your virtual classroom awaits.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setIsOfflineManagerOpen(true)}
                iconName="Download"
                iconPosition="left"
              >
                Offline Content
              </Button>
              <Button
                variant="default"
                onClick={() => navigate('/live-classroom')}
                iconName="Video"
                iconPosition="left"
              >
                Start Live Session
              </Button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 mb-6 border-b border-border">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
                activeTab === tab?.id
                  ? 'text-primary border-primary' :'text-muted-foreground border-transparent hover:text-foreground hover:border-border'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Actions */}
              <QuickActions
                onCreateSession={handleCreateSession}
                onCreatePoll={handleCreatePoll}
                onViewAnalytics={handleViewAnalytics}
                onManageContent={handleManageContent}
              />

              {/* Today's Sessions */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">Today's Sessions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sessions?.filter(session => session?.date === '18/09/2025')?.map((session) => (
                    <SessionCard
                      key={session?.id}
                      session={session}
                      onStartSession={handleStartSession}
                      onViewDetails={handleViewSessionDetails}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              <TechnicalStatus />
              <UpcomingSchedule
                upcomingSessions={upcomingSessions}
                onJoinSession={handleJoinSession}
                onReschedule={handleReschedule}
              />
            </div>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">All Sessions</h2>
              <Button
                variant="default"
                onClick={handleCreateSession}
                iconName="Plus"
                iconPosition="left"
              >
                Create Session
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {sessions?.map((session) => (
                <SessionCard
                  key={session?.id}
                  session={session}
                  onStartSession={handleStartSession}
                  onViewDetails={handleViewSessionDetails}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Analytics Dashboard</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" iconName="Download">
                  Export
                </Button>
                <Button variant="outline" size="sm" iconName="RefreshCw">
                  Refresh
                </Button>
              </div>
            </div>
            <AnalyticsPanel analyticsData={analyticsData} />
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-6">
            <ContentLibraryWidget
              contentItems={contentItems}
              onUploadContent={handleUploadContent}
              onViewLibrary={handleViewLibrary}
            />
          </div>
        )}
      </main>
      {/* Progress Context Bar */}
      <ProgressContextBar
        position="bottom"
        sessionProgress={0}
        downloadProgress={{}}
        learningMilestones={[]}
      />
      {/* Offline Content Manager */}
      <OfflineContentManager
        isOpen={isOfflineManagerOpen}
        onClose={() => setIsOfflineManagerOpen(false)}
        availableContent={availableOfflineContent}
        downloadedContent={downloadedOfflineContent}
      />
    </div>
  );
};

export default EducatorDashboard;