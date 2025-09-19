/**
 * Utility functions for authentication
 */

/**
 * Check if user is authenticated based on localStorage
 * @returns {boolean} True if authenticated, false otherwise
 */
export const isAuthenticated = () => {
  try {
    const authData = localStorage.getItem('vidyant_auth');
    if (!authData) return false;
    
    const { token } = JSON.parse(authData);
    return !!token;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

/**
 * Get user data from localStorage
 * @returns {Object|null} User data or null if not authenticated
 */
export const getUserData = () => {
  try {
    const authData = localStorage.getItem('vidyant_auth');
    const userData = localStorage.getItem('vidyant_user');
    
    if (!authData || !userData) return null;
    
    const { user } = JSON.parse(authData);
    const userInfo = JSON.parse(userData);
    
    return { ...user, ...userInfo };
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

/**
 * Get user role from localStorage
 * @returns {string} User role or 'guest' if not authenticated
 */
export const getUserRole = () => {
  try {
    const userData = localStorage.getItem('vidyant_user');
    if (!userData) return 'guest';
    
    const { role } = JSON.parse(userData);
    return role || 'guest';
  } catch (error) {
    console.error('Error getting user role:', error);
    return 'guest';
  }
};

/**
 * Clear authentication data from localStorage
 */
export const logout = () => {
  localStorage.removeItem('vidyalink_auth');
  localStorage.removeItem('vidyalink_user');
  if (!localStorage.getItem('vidyalink_remember')) {
    localStorage.removeItem('vidyalink_remember');
  }
  
  // Redirect to login page
  window.location.href = '/login';
};