import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import RoleAdaptiveHeader from '../../components/ui/RoleAdaptiveHeader';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
// Import socket utilities
import * as socketUtils from '../../utils/socketService.js';

// Component to display a peer's video stream
const PeerVideo = ({ peerId, peerVideosRef }) => {
  const videoRef = useRef(null);
  
  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement && peerVideosRef.current[peerId]) {
      videoElement.srcObject = peerVideosRef.current[peerId];
    }
    
    return () => {
      if (videoElement) {
        videoElement.srcObject = null;
      }
    };
  }, [peerId, peerVideosRef]);
  
  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      className="w-full h-full object-cover"
    />
  );
};

const VideoConference = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [peers, setPeers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  
  // References
  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerConnectionsRef = useRef({});
  const peerVideosRef = useRef({});
  const roomId = location.state?.roomId || 'default-room';

  // Initialize video conference
  useEffect(() => {
    const initConference = async () => {
      try {
        // Join the room with user data
        const userData = {
          userId: user?._id,
          name: user?.name || user?.username,
          title: location.state?.title || `Conference ${roomId}`
        };
        socketUtils.joinCall(roomId, userData);
        setConnectionStatus('connected');
        
        // Setup event listeners
        socketUtils.onUserJoined((userId, userData) => {
          console.log('User joined:', userId, userData);
          const peerName = userData?.name || `User-${userId.substring(0, 5)}`;
          setPeers(prev => [...prev, { id: userId, name: peerName }]);
          
          // Create peer connection for the new user
          createPeerConnection(userId, true);
        });
        
        socketUtils.onUserLeft((userId) => {
          console.log('User left:', userId);
          setPeers(prev => prev.filter(peer => peer.id !== userId));
          
          // Clean up peer connection
          if (peerConnectionsRef.current[userId]) {
            peerConnectionsRef.current[userId].close();
            delete peerConnectionsRef.current[userId];
          }
        });
        
        socketUtils.onChatMessage((data, sender, senderId) => {
          setMessages(prev => [...prev, { text: data, sender, senderId, timestamp: new Date() }]);
        });
        
        // Handle WebRTC signaling
        socketUtils.onSignal(async (signal, userId) => {
          try {
            console.log('Received signal from:', userId, signal.type);
            
            // Create peer connection if it doesn't exist
            if (!peerConnectionsRef.current[userId]) {
              await createPeerConnection(userId, false);
            }
            
            const pc = peerConnectionsRef.current[userId];
            
            if (signal.type === 'offer') {
              await pc.setRemoteDescription(new RTCSessionDescription(signal));
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              socketUtils.sendSignal(answer, userId);
            } else if (signal.type === 'answer') {
              await pc.setRemoteDescription(new RTCSessionDescription(signal));
            } else if (signal.type === 'candidate') {
              await pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
            }
          } catch (error) {
            console.error('Error handling signal:', error);
          }
        });
        
        // Initialize local media
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true
        });
        
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Failed to initialize conference:', error);
        setConnectionStatus('error');
      }
    };
    
    initConference();
    
    return () => {
      // Cleanup local media
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Close all peer connections
      Object.values(peerConnectionsRef.current).forEach(pc => {
        if (pc && typeof pc.close === 'function') {
          pc.close();
        }
      });
      
      // Leave the call
      socketUtils.disconnectSocket();
      
      // Clear references
      peerConnectionsRef.current = {};
      peerVideosRef.current = {};
    };
  }, [roomId]);
  
  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };
  
  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };
  
  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      // Stop screen sharing
      if (localStreamRef.current) {
        const videoTrack = localStreamRef.current.getVideoTracks()[0];
        if (videoTrack) {
          videoTrack.stop();
        }
      }
      
      // Restore camera
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setIsScreenSharing(false);
      } catch (error) {
        console.error('Failed to restore camera:', error);
      }
    } else {
      // Start screen sharing
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const audioTrack = localStreamRef.current?.getAudioTracks()[0];
        
        if (audioTrack) {
          screenStream.addTrack(audioTrack);
        }
        
        localStreamRef.current = screenStream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        
        setIsScreenSharing(true);
        
        // Handle when user stops screen sharing
        screenStream.getVideoTracks()[0].onended = () => {
          toggleScreenShare();
        };
      } catch (error) {
        console.error('Failed to share screen:', error);
      }
    }
  };
  
  const sendMessage = () => {
    if (messageInput.trim()) {
      const sender = user?.name || 'Anonymous';
      socketUtils.sendChatMessage(messageInput, sender);
      setMessageInput('');
    }
  };
  
  const leaveCall = useCallback(() => {
    // Stop all local tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    // Close all peer connections
    Object.values(peerConnectionsRef.current).forEach(pc => {
      if (pc && typeof pc.close === 'function') {
        pc.close();
      }
    });
    
    // Clear references
    peerConnectionsRef.current = {};
    peerVideosRef.current = {};
    
    // Notify server that we're leaving
    socketUtils.disconnectSocket();
    
    // Navigate back
    navigate(-1);
  }, [navigate]);

  // Create a peer connection for a specific user
  const createPeerConnection = async (userId, isInitiator) => {
    try {
      console.log('Creating peer connection for:', userId, 'isInitiator:', isInitiator);
      
      // Configure ICE servers for STUN/TURN
      const configuration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      };
      
      // Create new RTCPeerConnection
      const pc = new RTCPeerConnection(configuration);
      peerConnectionsRef.current[userId] = pc;
      
      // Add local stream tracks to peer connection
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => {
          pc.addTrack(track, localStreamRef.current);
        });
      }
      
      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socketUtils.sendSignal({
            type: 'candidate',
            candidate: event.candidate
          }, userId);
        }
      };
      
      // Handle connection state changes
      pc.onconnectionstatechange = () => {
        console.log(`Connection state for ${userId}:`, pc.connectionState);
      };
      
      // Handle incoming tracks
      pc.ontrack = (event) => {
        console.log('Received remote track from:', userId);
        const [remoteStream] = event.streams;
        
        // Create or update video element for this peer
        if (!peerVideosRef.current[userId]) {
          peerVideosRef.current[userId] = remoteStream;
          
          // Update peers state to trigger re-render
          setPeers(prev => {
            const peerIndex = prev.findIndex(p => p.id === userId);
            if (peerIndex >= 0) {
              const updatedPeers = [...prev];
              updatedPeers[peerIndex] = {
                ...updatedPeers[peerIndex],
                hasVideo: true
              };
              return updatedPeers;
            }
            return prev;
          });
        }
      };
      
      // If we're the initiator, create and send an offer
      if (isInitiator) {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socketUtils.sendSignal(offer, userId);
      }
      
      return pc;
    } catch (error) {
      console.error('Error creating peer connection:', error);
      return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <RoleAdaptiveHeader />
      
      <div className="flex-1 flex flex-col md:flex-row p-4 gap-4">
        {/* Main video area */}
        <div className="flex-1 bg-card rounded-lg overflow-hidden shadow-md flex flex-col">
          <div className="relative aspect-video bg-black">
            {connectionStatus === 'connecting' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white">
                <div className="text-center">
                  <Icon name="Loader" className="animate-spin mx-auto mb-2" size={32} />
                  <p>Connecting to conference...</p>
                </div>
              </div>
            )}
            
            {connectionStatus === 'error' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white">
                <div className="text-center">
                  <Icon name="AlertTriangle" className="text-error mx-auto mb-2" size={32} />
                  <p>Failed to connect to conference</p>
                  <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>
                    Go Back
                  </Button>
                </div>
              </div>
            )}
            
            {/* Local video */}
            <video 
              ref={localVideoRef} 
              autoPlay 
              muted 
              playsInline
              className="w-full h-full object-cover"
            />
            
            {/* Participant videos */}
            {peers.map((peer, index) => (
              <div 
                key={peer.id} 
                className={`absolute w-1/4 aspect-video bg-gray-800 rounded overflow-hidden shadow-lg ${index === 0 ? 'bottom-4 right-4' : index === 1 ? 'bottom-4 right-32' : 'top-4 right-4'}`}
              >
                {peer.hasVideo ? (
                  <PeerVideo peerId={peer.id} peerVideosRef={peerVideosRef} />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    <p>{peer.name}</p>
                  </div>
                )}
              </div>
            ))}
            
            {/* Controls overlay */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 rounded-full px-4 py-2 flex items-center gap-4">
              <button 
                onClick={toggleAudio}
                className={`p-2 rounded-full ${isAudioEnabled ? 'bg-primary' : 'bg-error'}`}
              >
                <Icon name={isAudioEnabled ? 'Mic' : 'MicOff'} size={20} className="text-white" />
              </button>
              
              <button 
                onClick={toggleVideo}
                className={`p-2 rounded-full ${isVideoEnabled ? 'bg-primary' : 'bg-error'}`}
              >
                <Icon name={isVideoEnabled ? 'Video' : 'VideoOff'} size={20} className="text-white" />
              </button>
              
              <button 
                onClick={toggleScreenShare}
                className={`p-2 rounded-full ${isScreenSharing ? 'bg-primary' : 'bg-muted'}`}
              >
                <Icon name="Monitor" size={20} className="text-white" />
              </button>
              
              <button 
                onClick={leaveCall}
                className="p-2 rounded-full bg-error"
              >
                <Icon name="PhoneOff" size={20} className="text-white" />
              </button>
            </div>
          </div>
          
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-2">Video Conference: {roomId}</h2>
            <p className="text-muted-foreground">
              {connectionStatus === 'connected' ? 
                `Connected with ${peers.length} participants` : 
                'Establishing connection...'}
            </p>
          </div>
        </div>
        
        {/* Chat panel */}
        <div className="w-full md:w-80 bg-card rounded-lg shadow-md flex flex-col">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold">Conference Chat</h3>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.length > 0 ? (
              messages.map((message, index) => (
                <div key={index} className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{message.sender}</span>
                    <span className="text-xs text-muted-foreground">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm">{message.text}</p>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <Icon name="MessageSquare" size={32} className="mx-auto mb-2" />
                <p>No messages yet</p>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-background border border-border rounded-md px-3 py-2"
              />
              <Button onClick={sendMessage}>
                <Icon name="Send" size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoConference;