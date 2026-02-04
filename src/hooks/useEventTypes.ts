'use client';

import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '@/config/env';
import { EventType } from '@/types/event-type';
import { useAuth } from '@/context/AuthContext';

interface UseEventTypesReturn {
  eventTypes: EventType[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage event types
 */
export function useEventTypes(): UseEventTypesReturn {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { checkAuth } = useAuth();

  const fetchEventTypes = async () => {
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

      const response = await fetch(API_ENDPOINTS.EVENT_TYPES.LIST, {
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
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch event types' }));
        throw new Error(errorData.message || 'Failed to fetch event types');
      }

      const data = await response.json();
      setEventTypes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching event types:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch event types');
      setEventTypes([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEventTypes();
  }, []);

  return {
    eventTypes,
    isLoading,
    error,
    refetch: fetchEventTypes,
  };
}

