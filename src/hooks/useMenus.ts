'use client';

import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '@/config/env';
import { Menu } from '@/types/menu';
import { useAuth } from '@/context/AuthContext';

interface UseMenusReturn {
  menus: Menu[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage menus
 */
export function useMenus(): UseMenusReturn {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { checkAuth } = useAuth();

  const fetchMenus = async () => {
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

      const response = await fetch(API_ENDPOINTS.MENUS.LIST, {
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
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch menus' }));
        throw new Error(errorData.message || 'Failed to fetch menus');
      }

      const data = await response.json();
      setMenus(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching menus:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch menus');
      setMenus([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  return {
    menus,
    isLoading,
    error,
    refetch: fetchMenus,
  };
}

