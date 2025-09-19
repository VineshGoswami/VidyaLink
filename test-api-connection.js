// Simple script to test API connectivity
import axios from 'axios';

const testBackendConnection = async () => {
  try {
    console.log('Testing connection to backend API...');
    const response = await axios.get('http://localhost:8001/api/v1/users');
    console.log('Connection successful!');
    console.log('Response:', response.data);
    return true;
  } catch (error) {
    console.error('Connection failed:', error.message);
    if (error.response) {
      console.log('Response status:', error.response.status);
      console.log('Response data:', error.response.data);
    }
    return false;
  }
};

testBackendConnection();