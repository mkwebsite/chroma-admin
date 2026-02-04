'use client';

import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '@/config/env';
import { MenuRoute } from '@/types/menu-route';
import { useAuth } from '@/context/AuthContext';

interface UseMenuRoutesReturn {
  menuRoutes: MenuRoute[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage menu routes
 */
export function useMenuRoutes(): UseMenuRoutesReturn {
  const [menuRoutes, setMenuRoutes] = useState<MenuRoute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { checkAuth } = useAuth();

  const fetchMenuRoutes = async () => {
    if (!checkAuth()) {
      setError('Not authenticated');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get auth token from cookie
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('auth-token='))
        ?.split('=')[1];

      const response = await fetch(API_ENDPOINTS.MENU_ROUTES.LIST, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('Unauthorized. Please login again.');
          return;
        }
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch menu routes' }));
        throw new Error(errorData.message || 'Failed to fetch menu routes');
      }

      const data = await response.json();
      setMenuRoutes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching menu routes:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch menu routes');
      setMenuRoutes([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuRoutes();
  }, []);

  return {
    menuRoutes,
    isLoading,
    error,
    refetch: fetchMenuRoutes,
  };
}

