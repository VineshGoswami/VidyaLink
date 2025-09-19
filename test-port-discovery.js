// Test script for port discovery
import axios from 'axios';

const testPortDiscovery = async () => {
  // Ports to try
  const ports = [8000, 8001, 8002, 8003, 8004, 8005];
  
  console.log('Testing backend port discovery...');
  
  for (const port of ports) {
    try {
      console.log(`Trying port ${port}...`);
      const response = await axios.get(`http://localhost:${port}/api/v1/users`, {
        timeout: 1000
      });
      
      console.log(`✅ Success! Backend found on port ${port}`);
      console.log('Response status:', response.status);
      return port;
    } catch (error) {
      if (error.response) {
        // We got a response, but it might be an error response (401, 403, etc.)
        // This still means the server is running on this port
        console.log(`✅ Success! Backend found on port ${port} (status: ${error.response.status})`);
        return port;
      }
      console.log(`❌ Port ${port} not available or not responding`);
    }
  }
  
  console.log('❌ Could not find backend on any port');
  return null;
};

testPortDiscovery().then(port => {
  if (port) {
    console.log(`\nBackend is running on port ${port}`);
    console.log(`API URL: http://localhost:${port}/api/v1`);
  } else {
    console.log('\nFailed to discover backend port');
  }
});