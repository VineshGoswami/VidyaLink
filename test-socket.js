// Simple test script to check if socket.js exists
const fs = require('fs');
const path = require('path');

const socketJsPath = path.join(__dirname, 'frontend', 'src', 'utils', 'socket.js');
const socketServicePath = path.join(__dirname, 'frontend', 'src', 'utils', 'socketService.js');

console.log('Testing socket files existence...');

// Check if socket.js exists
if (fs.existsSync(socketJsPath)) {
  console.log('✅ socket.js exists at:', socketJsPath);
  const content = fs.readFileSync(socketJsPath, 'utf8');
  console.log('File size:', content.length, 'bytes');
  
  // Check for key functions
  const hasGetSocket = content.includes('getSocket');
  const hasJoinCall = content.includes('joinCall');
  const hasOnUserJoined = content.includes('onUserJoined');
  const hasOnUserLeft = content.includes('onUserLeft');
  
  console.log('Contains getSocket function:', hasGetSocket ? '✅' : '❌');
  console.log('Contains joinCall function:', hasJoinCall ? '✅' : '❌');
  console.log('Contains onUserJoined function:', hasOnUserJoined ? '✅' : '❌');
  console.log('Contains onUserLeft function:', hasOnUserLeft ? '✅' : '❌');
} else {
  console.log('❌ socket.js does not exist at:', socketJsPath);
}

// Check if socketService.js exists
if (fs.existsSync(socketServicePath)) {
  console.log('\n✅ socketService.js exists at:', socketServicePath);
  const content = fs.readFileSync(socketServicePath, 'utf8');
  console.log('File size:', content.length, 'bytes');
  
  // Check for key functions
  const hasGetSocket = content.includes('getSocket');
  const hasJoinCall = content.includes('joinCall');
  const hasOnUserJoined = content.includes('onUserJoined');
  const hasOnUserLeft = content.includes('onUserLeft');
  
  console.log('Contains getSocket function:', hasGetSocket ? '✅' : '❌');
  console.log('Contains joinCall function:', hasJoinCall ? '✅' : '❌');
  console.log('Contains onUserJoined function:', hasOnUserJoined ? '✅' : '❌');
  console.log('Contains onUserLeft function:', hasOnUserLeft ? '✅' : '❌');
} else {
  console.log('\n❌ socketService.js does not exist at:', socketServicePath);
}