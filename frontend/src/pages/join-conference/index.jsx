import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../../components/AppIcon';

const JoinConference = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  
  // Get roomId from URL parameters
  const roomId = searchParams.get('roomId');
  
  useEffect(() => {
    // If no roomId is provided, redirect to dashboard
    if (!roomId) {
      navigate('/');
      return;
    }
    
    // If user is not authenticated, redirect to login
    if (!isAuthenticated) {
      // Store the roomId in sessionStorage to retrieve after login
      sessionStorage.setItem('pendingConferenceRoomId', roomId);
      navigate('/login');
      return;
    }
    
    // Navigate to the video conference with the roomId
    navigate('/video-conference', { 
      state: { 
        roomId, 
        title: 'Joined Conference',
      } 
    });
  }, [roomId, isAuthenticated, navigate]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-lg border border-border">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Icon name="Video" size={32} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Joining Conference</h1>
          <p className="text-muted-foreground mt-2">Please wait while we connect you...</p>
        </div>
        
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    </div>
  );
};

export default JoinConference;