'use strict';
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { api } from '../lib/api';
import { connectSocketWithToken, disconnectSocket } from '../lib/socket';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password_raw: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error('Logout request failed:', e);
    } finally {
      localStorage.removeItem('accessToken');
      setUser(null);
      setIsLoading(false);
      disconnectSocket(); // Disconnect socket session
      router.push('/dashboard/login');
    }
  }, [router]);

  const checkSession = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setUser(null);
      setIsLoading(false);
      if (pathname !== '/dashboard/login') {
        router.push('/dashboard/login');
      }
      return;
    }

    try {
      const response = await api.get('/auth/me');
      setUser(response.data.data.user);
      connectSocketWithToken(token); // Synchronize socket session
    } catch (error) {
      console.error('Check session handshake failed:', error);
      setUser(null);
      disconnectSocket();
      if (pathname !== '/dashboard/login') {
        router.push('/dashboard/login');
      }
    } finally {
      setIsLoading(false);
    }
  }, [pathname, router]);

  const login = async (email: string, password_raw: string) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password: password_raw });
      const { accessToken, user: userData } = response.data.data;
      
      localStorage.setItem('accessToken', accessToken);
      setUser(userData);
      connectSocketWithToken(accessToken); // Initialize socket connection on login success
      router.push('/dashboard');
    } catch (error: any) {
      setUser(null);
      disconnectSocket();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Listen for automatic token expiry events from API interceptors
  useEffect(() => {
    const handleAuthExpired = () => {
      logout();
    };

    window.addEventListener('auth-expired', handleAuthExpired);
    return () => {
      window.removeEventListener('auth-expired', handleAuthExpired);
    };
  }, [logout]);

  useEffect(() => {
    checkSession();
  }, [pathname, checkSession]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be wrapped inside AuthProvider context');
  }
  return context;
}
