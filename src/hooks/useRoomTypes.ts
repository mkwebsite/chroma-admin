'use client';

import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '@/config/env';
import { RoomType } from '@/types/room-type';
import { useAuth } from '@/context/AuthContext';

interface UseRoomTypesReturn {
  roomTypes: RoomType[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage room types
 */
export function useRoomTypes(): UseRoomTypesReturn {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { checkAuth } = useAuth();

  const fetchRoomTypes = async () => {
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

      const response = await fetch(API_ENDPOINTS.ROOM_TYPES.LIST, {
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
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch room types' }));
        throw new Error(errorData.message || 'Failed to fetch room types');
      }

      const data = await response.json();
      setRoomTypes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching room types:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch room types');
      setRoomTypes([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  return {
    roomTypes,
    isLoading,
    error,
    refetch: fetchRoomTypes,
  };
}

