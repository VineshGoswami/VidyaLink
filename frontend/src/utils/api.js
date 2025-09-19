import axios from "axios";

// Function to discover available backend port
const discoverBackendPort = async () => {
  // Default ports to try in order - include all ports the backend might use
  const portsToTry = [8001, 8002, 8003, 8004, 8005, 8000];
  const savedPort = localStorage.getItem('vidyant_backend_port');
  
  // If we have a saved port, try it first
  if (savedPort) {
    portsToTry.unshift(parseInt(savedPort, 10));
  }
  
  // Try each port
  for (const port of portsToTry) {
    try {
      const testUrl = `http://localhost:${port}/api/v1/auth/me`;
      const response = await fetch(testUrl, { 
        method: 'HEAD', 
        timeout: 2000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      // Any response from the server is good enough to confirm it's running
      // Even 401/403 (unauthorized) or 404 (not found) means the server is there
      if (response.status >= 200 && response.status < 600) {
        // Save the working port for future use
        localStorage.setItem('vidyant_backend_port', port.toString());
        console.log(`API connected to backend at port ${port}`);
        return `http://localhost:${port}`;
      }
    } catch (error) {
      // Continue to next port
      console.log(`Port ${port} not available, trying next...`);
    }
  }
  
  // If all ports fail, return the default from env
  console.warn('Could not find available backend port, using default from env or 8003');
  return import.meta?.env?.VITE_API_URL || "http://localhost:8003";
};

// Prefer Vite env, fallback to localhost backend with port discovery
const baseURL = import.meta?.env?.VITE_API_URL || "http://localhost:8001";

// Initialize with default, will be updated after port discovery
let discoveredBaseURL = baseURL;

// Create initial API instance
export const api = axios.create({
  baseURL: `${baseURL}/api/v1`,
  withCredentials: false,
  timeout: 20000
});

// Update the API baseURL after port discovery
discoverBackendPort().then(url => {
  discoveredBaseURL = url;
  api.defaults.baseURL = `${discoveredBaseURL}/api/v1`;
  console.log(`API connected to backend at: ${discoveredBaseURL}`);
}).catch(err => {
  console.error('Failed to discover backend port:', err);
});

// Attach Authorization header if token exists
api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem("vidyant_auth");
    if (raw) {
      const { token } = JSON.parse(raw) || {};
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (_) {}
  return config;
});

// Handle 401s centrally
api.interceptors.response.use(
  (resp) => resp,
  (error) => {
    if (error?.response?.status === 401) {
      // Clear auth and optionally redirect to login
      localStorage.removeItem("vidyant_auth");
    }
    return Promise.reject(error);
  }
);

export default api;


