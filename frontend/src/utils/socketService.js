import { io } from "socket.io-client";

// Function to discover available backend port
export const discoverBackendPort = async () => {
  // Default ports to try in order - prioritize 8001 since we know it's working
  const portsToTry = [8001, 8000, 8002, 8003, 8004, 8005];
  const savedPort = localStorage.getItem('vidyalink_backend_port');
  
  // If we have a saved port, try it first
  if (savedPort) {
    portsToTry.unshift(parseInt(savedPort, 10));
  }
  
  // Try each port
  for (const port of portsToTry) {
    try {
      const testUrl = `http://localhost:${port}/api/v1/users`;
      const response = await fetch(testUrl, { 
        method: 'HEAD', 
        timeout: 1000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      if (response.ok || response.status === 401 || response.status === 403) {
        // Save the working port for future use
        localStorage.setItem('vidyalink_backend_port', port.toString());
        console.log(`Backend found on port ${port}`);
        return port;
      }
    } catch (error) {
      // Continue to next port
      console.log(`Port ${port} not available, trying next...`);
    }
  }
  
  // If all ports fail, return port 8001 as default
  console.warn('Could not find available backend port, using default 8001');
  return 8001;
};

// Socket instance
let socketInstance = null;
let baseURL = null;

// Function to get the socket instance
export const getSocket = () => {
  if (!socketInstance) {
    try {
      if (!baseURL) {
        baseURL = import.meta?.env?.VITE_API_URL || "http://localhost:8001";
      }
      
      socketInstance = io(baseURL, {
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        timeout: 10000
      });
      
      // Add error handling
      socketInstance.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });
      
      socketInstance.on('connect_timeout', () => {
        console.error('Socket connection timeout');
      });
      
      socketInstance.on('connect', () => {
        console.log('Socket connected successfully');
      });
    } catch (error) {
      console.error('Error creating socket instance:', error);
    }
  }
  return socketInstance;
};

// Function to connect to the socket
export const connectSocket = async (userId) => {
  try {
    if (!baseURL) {
      const port = await discoverBackendPort();
      baseURL = `http://localhost:${port}`;
    }
    
    if (socketInstance) {
      // If already connected, disconnect first
      socketInstance.disconnect();
      socketInstance = null;
    }
    
    socketInstance = io(baseURL, {
      query: { userId },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      timeout: 10000
    });
    
    // Add error handling
    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
    
    socketInstance.on('connect_timeout', () => {
      console.error('Socket connection timeout');
    });
    
    socketInstance.on('connect', () => {
      console.log('Socket connected successfully with userId:', userId);
    });
    
    return socketInstance;
  } catch (error) {
    console.error('Error connecting to socket:', error);
    return null;
  }
};

// Function to disconnect from the socket
export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};

// Video conference functions
export const joinCall = (roomPath, userData) => {
  const socket = getSocket();
  socket.emit("join-call", roomPath, userData);
};

export const onUserJoined = (cb) => getSocket().on("user-joined", cb);
export const onUserLeft = (cb) => getSocket().on("user-left", cb);
export const onChatMessage = (cb) => getSocket().on("chat-message", cb);
export const onSignal = (cb) => getSocket().on("signal", cb);
export const sendSignal = (signal, userId) => getSocket().emit("signal", signal, userId);
export const sendChatMessage = (data, sender) => getSocket().emit("chat-message", data, sender);