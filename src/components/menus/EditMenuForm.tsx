'use client';

import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '@/config/env';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Menu } from '@/types/menu';
import Button from '@/components/ui/button/Button';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import { ChevronDownIcon } from '@/icons';

interface EditMenuFormProps {
  menu: Menu;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EditMenuForm({ menu, onSuccess, onCancel }: EditMenuFormProps) {
  const [formData, setFormData] = useState({
    name: menu.name || '',
    status: menu.status || 'active',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { checkAuth } = useAuth();
  const { success: showSuccessToast } = useToast();

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  // Update form data when menu changes
  useEffect(() => {
    setFormData({
      name: menu.name || '',
      status: menu.status || 'active',
    });
  }, [menu]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      name: e.target.value,
    }));
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      status: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!checkAuth()) {
      setError('Not authenticated. Please login again.');
      return;
    }

    // Validate required fields
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    setIsSubmitting(true);

    try {
      // Get auth token from cookie
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('auth-token='))
        ?.split('=')[1];

      const payload = {
        name: formData.name.trim(),
        status: formData.status,
      };

      const response = await fetch(API_ENDPOINTS.MENUS.UPDATE(menu._id), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('Unauthorized. Please login again.');
          return;
        }
        const errorData = await response.json().catch(() => ({
          message: 'Failed to update menu',
        }));
        throw new Error(errorData.message || 'Failed to update menu');
      }

      // Success - show toast and call onSuccess
      showSuccessToast('Menu updated successfully', 'Success');
      onSuccess();
    } catch (err) {
      console.error('Error updating menu:', err);
      setError(err instanceof Error ? err.message : 'Failed to update menu');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h4 className="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90">
        Edit Menu
      </h4>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}

      {/* Name Field */}
      <div>
        <Label htmlFor="edit-name">Menu Name *</Label>
        <Input
          type="text"
          id="edit-name"
          name="name"
          placeholder="e.g., Dashboard"
          value={formData.name}
          onChange={handleNameChange}
          disabled={isSubmitting}
          required
        />
      </div>

      {/* Status Field */}
      <div>
        <Label htmlFor="edit-status">Status</Label>
        <div className="relative">
          <Select
            options={statusOptions}
            placeholder="Select Status"
            onChange={handleStatusChange}
            defaultValue={formData.status}
            className="dark:bg-dark-900"
          />
          <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
            <ChevronDownIcon />
          </span>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end w-full gap-3 mt-6">
        <Button
          size="sm"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Updating...' : 'Update Menu'}
        </button>
      </div>
    </form>
  );
}

