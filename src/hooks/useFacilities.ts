'use client';

import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '@/config/env';
import { Facility } from '@/types/facility';
import { useAuth } from '@/context/AuthContext';

interface UseFacilitiesReturn {
  facilities: Facility[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage facilities
 */
export function useFacilities(): UseFacilitiesReturn {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { checkAuth } = useAuth();

  const fetchFacilities = async () => {
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

      const response = await fetch(API_ENDPOINTS.FACILITIES.LIST, {
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
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch facilities' }));
        throw new Error(errorData.message || 'Failed to fetch facilities');
      }

      const data = await response.json();
      setFacilities(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching facilities:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch facilities');
      setFacilities([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  return {
    facilities,
    isLoading,
    error,
    refetch: fetchFacilities,
  };
}

