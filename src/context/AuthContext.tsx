'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ROUTES } from '@/config/routes';
import { API_ENDPOINTS } from '@/config/env';

interface User {
  id: string;
  _id?: string; // API returns _id
  email: string;
  name: string;
  fullName?: string; // API returns fullName
  username?: string;
  phone?: string;
  profilePhoto?: string;
  roles?: string[]; // API returns roles array
  role?: string; // For backward compatibility
  status?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => boolean;
  getRefreshToken: () => string | null;
  getSession: () => any | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check authentication status on mount and when pathname changes
  useEffect(() => {
    checkAuthStatus();
  }, [pathname]);

  const checkAuthStatus = () => {
    setIsLoading(true);
    
    // Check for auth token in cookies
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth-token='))
      ?.split('=')[1];

    if (token) {
      // Load user data from localStorage (set after successful login)
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          // If token exists but no user data, clear auth and logout
          logout();
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        logout();
      }
    } else {
      setUser(null);
    }
    
    setIsLoading(false);
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Use API endpoint from environment variables
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
        throw new Error(errorData.message || 'Login failed');
      }

      // Real API response
      const data = await response.json();
      
      // Set access token in cookie
      if (data.accessToken) {
        document.cookie = `auth-token=${data.accessToken}; path=/; max-age=${60 * 60 * 24 * 7}`;
      }
      
      // Store refresh token if provided
      if (data.refreshToken) {
        localStorage.setItem('refresh-token', data.refreshToken);
      }
      
      // Store session data if provided
      if (data.session) {
        localStorage.setItem('session', JSON.stringify(data.session));
      }
      
      // Map and store user data
      if (data.user) {
        // Map API user object to our User interface
        const mappedUser: User = {
          id: data.user._id || data.user.id || '',
          _id: data.user._id,
          email: data.user.email,
          name: data.user.fullName || data.user.name || data.user.username || '',
          fullName: data.user.fullName,
          username: data.user.username,
          phone: data.user.phone,
          profilePhoto: data.user.profilePhoto,
          roles: data.user.roles || [],
          role: data.user.roles?.[0] || data.user.role, // Use first role for backward compatibility
          status: data.user.status,
          emailVerified: data.user.emailVerified,
          phoneVerified: data.user.phoneVerified,
        };
        
        localStorage.setItem('user', JSON.stringify(mappedUser));
        setUser(mappedUser);
      }
      
      // Redirect to home/dashboard or return URL
      // Use window.location for immediate redirect to ensure cookie is available
      const returnUrl = new URLSearchParams(window.location.search).get('returnUrl');
      // Default to /admin where the actual dashboard is located
      const redirectPath = returnUrl || '/admin';
      
      // Small delay to ensure cookie is set before redirect
      setTimeout(() => {
        window.location.href = redirectPath;
      }, 100);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Remove auth token
    document.cookie = 'auth-token=; path=/; max-age=0';
    // Remove refresh token and session
    localStorage.removeItem('user');
    localStorage.removeItem('refresh-token');
    localStorage.removeItem('session');
    setUser(null);
    
    // Redirect to signin
    router.push(ROUTES.AUTH.SIGNIN);
  };

  const checkAuth = (): boolean => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth-token='))
      ?.split('=')[1];
    
    return !!token;
  };

  const getRefreshToken = (): string | null => {
    return localStorage.getItem('refresh-token');
  };

  const getSession = (): any | null => {
    const session = localStorage.getItem('session');
    return session ? JSON.parse(session) : null;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    checkAuth,
    getRefreshToken,
    getSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

