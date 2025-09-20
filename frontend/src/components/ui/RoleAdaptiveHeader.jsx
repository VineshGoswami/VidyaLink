import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import ConnectionStatusIndicator from './ConnectionStatusIndicator';
import { useAuth } from '../../contexts/AuthContext';

const RoleAdaptiveHeader = ({ 
  user: propUser,
  onNavigate = () => {},
  className = '' 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user: authUser, logout } = useAuth();
  
  // Use auth context user data if available, otherwise use props
  const user = authUser || propUser || { role: 'student', name: 'User' };

  const navigationItems = {
    student: [
      { label: 'Dashboard', path: '/student-dashboard', icon: 'Home' },
      { label: 'Live Classroom', path: '/live-classroom', icon: 'Video' },
      { label: 'Video Conference', path: '/video-conference', icon: 'PhoneCall' },
      { label: 'Content Library', path: '/content-library', icon: 'BookOpen' },
      { label: 'Recordings', path: '/session-recording-player', icon: 'Play' },
    ],
    educator: [
      { label: 'Dashboard', path: '/educator-dashboard', icon: 'LayoutDashboard' },
      { label: 'Live Classroom', path: '/live-classroom', icon: 'Video' },
      { label: 'Video Conference', path: '/video-conference', icon: 'PhoneCall' },
      { label: 'Content Library', path: '/content-library', icon: 'BookOpen' },
      { label: 'Recordings', path: '/session-recording-player', icon: 'Play' },
    ],
    admin: [
      { label: 'Dashboard', path: '/educator-dashboard', icon: 'LayoutDashboard' },
      { label: 'Live Sessions', path: '/live-classroom', icon: 'Video' },
      { label: 'Video Conference', path: '/video-conference', icon: 'PhoneCall' },
      { label: 'Content', path: '/content-library', icon: 'BookOpen' },
      { label: 'Analytics', path: '/session-recording-player', icon: 'BarChart3' },
    ]
  };

  const currentNavItems = navigationItems?.[user?.role] || navigationItems?.student;

  const handleNavigation = (path) => {
    navigate(path);
    onNavigate(path);
    setIsMobileMenuOpen(false);
  };

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className={`sticky top-0 z-40 w-full bg-card border-b border-border ${className}`}>
      <div className="flex h-16 items-center px-4 lg:px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 text-primary-foreground"
              fill="currentColor"
            >
              <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
              <path d="M8 11l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </div>
          <h1 className="text-xl font-bold text-foreground font-heading">
            Vidyant
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 ml-8">
          {currentNavItems?.map((item) => (
            <button
              key={item?.path}
              onClick={() => handleNavigation(item?.path)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 min-touch-target ${
                isActivePath(item?.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Icon name={item?.icon} size={16} />
              <span>{item?.label}</span>
            </button>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="ml-auto flex items-center gap-3">
          <ConnectionStatusIndicator />
          
          {/* User Menu */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-foreground">
                {user?.name}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                {user?.role}
              </p>
            </div>
            <div className="relative">
              <div 
                className="w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              >
                <span className="text-sm font-medium text-primary-foreground">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-1 z-50">
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setIsProfileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 text-left"
                  >
                    <Icon name="User" size={16} />
                    <span>Profile</span>
                  </button>
                  <div className="border-t border-border my-1"></div>
                  <button
                    onClick={() => {
                      logout();
                      setIsProfileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 text-left"
                  >
                    <Icon name="LogOut" size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors min-touch-target"
            aria-label="Toggle mobile menu"
          >
            <Icon 
              name={isMobileMenuOpen ? 'X' : 'Menu'} 
              size={20} 
              className="text-foreground"
            />
          </button>
        </div>
      </div>
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card animate-slide-in">
          <nav className="px-4 py-3 space-y-1">
            {currentNavItems?.map((item) => (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 min-touch-target ${
                  isActivePath(item?.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Icon name={item?.icon} size={18} />
                <span>{item?.label}</span>
              </button>
            ))}
            <button
              onClick={logout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 min-touch-target text-muted-foreground hover:text-foreground hover:bg-muted/50"
            >
              <Icon name="LogOut" size={18} />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default RoleAdaptiveHeader;