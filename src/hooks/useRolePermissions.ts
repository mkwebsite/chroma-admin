'use client';

import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '@/config/env';
import { RolePermission } from '@/types/role-permission';
import { useAuth } from '@/context/AuthContext';

interface UseRolePermissionsReturn {
  rolePermissions: RolePermission[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage role permissions
 */
export function useRolePermissions(roleId?: string): UseRolePermissionsReturn {
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { checkAuth } = useAuth();

  const fetchRolePermissions = async () => {
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

      const response = await fetch(API_ENDPOINTS.ROLE_PERMISSIONS.LIST, {
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
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch role permissions' }));
        throw new Error(errorData.message || 'Failed to fetch role permissions');
      }

      const data = await response.json();
      const allPermissions = Array.isArray(data) ? data : [];
      
      // Filter by role_id if provided
      const filtered = roleId 
        ? allPermissions.filter((rp: RolePermission) => rp.role_id === roleId)
        : allPermissions;
      
      setRolePermissions(filtered);
    } catch (err) {
      console.error('Error fetching role permissions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch role permissions');
      setRolePermissions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRolePermissions();
  }, [roleId]);

  return {
    rolePermissions,
    isLoading,
    error,
    refetch: fetchRolePermissions,
  };
}

