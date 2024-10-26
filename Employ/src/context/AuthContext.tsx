import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../services/types';
import { db } from '../services/database';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, company: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const existingUser = await db.getUserByEmail(email);
    
    if (!existingUser) {
      const newUser: User = {
        id: Date.now().toString(),
        name: 'Jane Doe',
        email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        company: 'Tech Corp',
        role: 'Software Engineer'
      };
      await db.createUser(newUser);
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } else {
      setUser(existingUser);
      localStorage.setItem('user', JSON.stringify(existingUser));
    }
  };

  const signup = async (name: string, email: string, password: string, company: string) => {
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      company,
      role: 'Member'
    };
    
    await db.createUser(newUser);
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};