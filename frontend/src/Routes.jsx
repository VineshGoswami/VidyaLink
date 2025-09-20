import React from "react";
import { Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import SessionRecordingPlayer from './pages/session-recording-player';
import Login from './pages/login';
import Signup from './pages/signup';
import LiveClassroom from './pages/live-classroom';
import StudentDashboard from './pages/student-dashboard';
import ContentLibrary from './pages/content-library';
import EducatorDashboard from './pages/educator-dashboard';
import VideoConference from './pages/video-conference';
import JoinConference from './pages/join-conference';
import Profile from './pages/profile';

// Import authentication components
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

const Routes = () => {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
            {/* Public Routes */}
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            
            <Route path="/signup" element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            } />
            
            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <ContentLibrary />
              </ProtectedRoute>
            } />
            
            <Route path="/session-recording-player" element={
              <ProtectedRoute>
                <SessionRecordingPlayer />
              </ProtectedRoute>
            } />
            
            <Route path="/join-conference" element={
              <JoinConference />
            } />
            
            <Route path="/live-classroom" element={
              <ProtectedRoute>
                <LiveClassroom />
              </ProtectedRoute>
            } />
            
            <Route path="/student-dashboard" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/content-library" element={
              <ProtectedRoute>
                <ContentLibrary />
              </ProtectedRoute>
            } />
            
            <Route path="/educator-dashboard" element={
              <ProtectedRoute allowedRoles={['educator', 'admin']}>
                <EducatorDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/video-conference" element={
              <ProtectedRoute>
                <VideoConference />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
      </ErrorBoundary>
  );
};

export default Routes;
