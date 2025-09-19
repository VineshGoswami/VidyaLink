// Test script to verify socketService.js loads correctly
import { getSocket, connectSocket, onUserJoined, onUserLeft } from './VidyaLink/frontend/src/utils/socketService.js';

console.log('Testing socketService.js loading...');

try {
  // Test if we can connect to socket
  connectSocket('test-user-id').then(socket => {
    console.log('Socket connection successful:', socket !== null);
    
    // Test socket functions exist
    console.log('getSocket function exists:', typeof getSocket === 'function');
    console.log('onUserJoined function exists:', typeof onUserJoined === 'function');
    console.log('onUserLeft function exists:', typeof onUserLeft === 'function');
    
    console.log('socketService.js loaded successfully!');
  }).catch(error => {
    console.error('Error connecting socket:', error);
  });
} catch (error) {
  console.error('Error loading socketService.js:', error);
}