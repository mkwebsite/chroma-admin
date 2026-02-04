'use client';

import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '@/config/env';
import { PropertyType } from '@/types/property-type';
import { useAuth } from '@/context/AuthContext';

interface UsePropertyTypesReturn {
  propertyTypes: PropertyType[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage property types
 */
export function usePropertyTypes(): UsePropertyTypesReturn {
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { checkAuth } = useAuth();

  const fetchPropertyTypes = async () => {
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

      const response = await fetch(API_ENDPOINTS.PROPERTY_TYPES.LIST, {
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
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch property types' }));
        throw new Error(errorData.message || 'Failed to fetch property types');
      }

      const data = await response.json();
      setPropertyTypes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching property types:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch property types');
      setPropertyTypes([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPropertyTypes();
  }, []);

  return {
    propertyTypes,
    isLoading,
    error,
    refetch: fetchPropertyTypes,
  };
}

