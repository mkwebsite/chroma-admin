'use client';

import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '@/config/env';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Role } from '@/types/role';
import Button from '@/components/ui/button/Button';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import TextArea from '@/components/form/input/TextArea';

interface EditRoleFormProps {
  role: Role;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EditRoleForm({ role, onSuccess, onCancel }: EditRoleFormProps) {
  const [formData, setFormData] = useState({
    name: role.name || '',
    description: role.description || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { checkAuth } = useAuth();
  const { success: showSuccessToast } = useToast();

  // Update form data when role changes
  useEffect(() => {
    setFormData({
      name: role.name || '',
      description: role.description || '',
    });
  }, [role]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      name: e.target.value,
    }));
  };

  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      description: value,
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
        description: formData.description.trim(),
      };

      const response = await fetch(API_ENDPOINTS.ROLES.UPDATE(role._id), {
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
          message: 'Failed to update role',
        }));
        throw new Error(errorData.message || 'Failed to update role');
      }

      // Success - show toast and call onSuccess
      showSuccessToast('Role updated successfully', 'Success');
      onSuccess();
    } catch (err) {
      console.error('Error updating role:', err);
      setError(err instanceof Error ? err.message : 'Failed to update role');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h4 className="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90">
        Edit Role
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
        <Label htmlFor="edit-name">Role Name *</Label>
        <Input
          type="text"
          id="edit-name"
          name="name"
          placeholder="e.g., Administrator"
          value={formData.name}
          onChange={handleNameChange}
          disabled={isSubmitting}
          required
        />
      </div>

      {/* Description Field */}
      <div>
        <Label htmlFor="edit-description">Description</Label>
        <TextArea
          placeholder="Enter role description"
          rows={4}
          value={formData.description}
          onChange={handleDescriptionChange}
          disabled={isSubmitting}
        />
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
          {isSubmitting ? 'Updating...' : 'Update Role'}
        </button>
      </div>
    </form>
  );
}

