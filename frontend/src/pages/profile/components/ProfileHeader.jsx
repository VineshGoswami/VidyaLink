import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';

const ProfileHeader = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  // Generate initials for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-t-xl text-white">
      <div className="flex items-center">
        <div className="w-16 h-16 rounded-full bg-white text-indigo-600 flex items-center justify-center text-xl font-bold">
          {getInitials(user.name)}
        </div>
        <div className="ml-4">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="opacity-90">{user.email}</p>
          <span className="inline-block mt-1 px-2 py-1 bg-white bg-opacity-20 rounded-full text-xs">
            {user.role === 'student' ? 'Student' : user.role === 'teacher' ? 'Teacher' : 'Admin'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;