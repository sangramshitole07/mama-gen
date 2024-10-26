import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">MomAtWork Forum</h1>
          </div>
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                <span>{user.name}</span>
              </div>
              <button
                onClick={logout}
                className="p-2 hover:bg-indigo-700 rounded-full"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <UserIcon size={20} />
              <span>Guest</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};