import { io } from "socket.io-client";

// Socket module initialization

// Function to discover available backend port
const discoverBackendPort = async () => {
  // Default ports to try in order - prioritize 8001 since we know it's working
  const portsToTry = [8001, 8000, 8002, 8003, 8004, 8005];
  const savedPort = localStorage.getItem('vidyant_backend_port');
  
  // If we have a saved port, try it first
  if (savedPort) {
    portsToTry.unshift(parseInt(savedPort, 10));
  }
  
  // Try each port
  for (const port of portsToTry) {
    try {
      const testUrl = `http://localhost:${port}/api/v1/users`;
      const response = await fetch(testUrl, { method: 'HEAD', timeout: 1000 });
      if (response.ok || response.status === 401 || response.status === 403) {
        // Save the working port for future use
        localStorage.setItem('vidyant_backend_port', port.toString());
        return `http://localhost:${port}`;
      }
    } catch (error) {
      // Continue to next port
      console.log(`Port ${port} not available, trying next...`);
    }
  }
  
  // If all ports fail, return port 8001 as default
  return import.meta?.env?.VITE_API_URL || "http://localhost:8001";
};

// Initial baseURL, will be updated after port discovery
let baseURL = import.meta?.env?.VITE_API_URL || "http://localhost:8001";
let socketInstance = null;

// Update baseURL after port discovery
discoverBackendPort().then(url => {
  baseURL = url;
  // If socket already exists, reconnect with new URL
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
});

export const getSocket = () => {
  if (!socketInstance) {
    socketInstance = io(baseURL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000
    });
  }
  return socketInstance;
};

export const joinCall = (roomPath, userData) => {
  const socket = getSocket();
  socket.emit("join-call", roomPath, userData);
};

export const onUserJoined = (cb) => getSocket().on("user-joined", cb);
export const onUserLeft = (cb) => getSocket().on("user-left", cb);
export const onChatMessage = (cb) => getSocket().on("chat-message", cb);
export const sendSignal = (toId, message) => getSocket().emit("signal", toId, message);
export const sendChatMessage = (data, sender) => getSocket().emit("chat-message", data, sender);

export default {
  getSocket,
  joinCall,
  onUserJoined,
  onUserLeft,
  onChatMessage,
  sendSignal,
  sendChatMessage
};


