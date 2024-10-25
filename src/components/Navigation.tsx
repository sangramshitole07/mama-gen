import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, BarChart2, BookOpen, MessageSquare, Monitor } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Exercise', icon: Activity },
    { path: '/hr-dashboard', label: 'Dashboard', icon: BarChart2 },
    { path: '/resources', label: 'Resources', icon: BookOpen },
    { path: '/communication', label: 'Communication', icon: MessageSquare },
    { path: '/ergonomics', label: 'Ergonomics', icon: Monitor },
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-3 py-4 text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-indigo-600'
              }`}
            >
              <item.icon className="w-5 h-5 mr-2" />
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;