'use client';

import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '@/config/env';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useRoles } from '@/hooks/useRoles';
import Button from '@/components/ui/button/Button';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';

interface AddUserFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddUserForm({ onSuccess, onCancel }: AddUserFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    fullName: '',
    phone: '',
    status: 'active' as 'active' | 'inactive' | 'suspended',
    roles: [] as string[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { checkAuth } = useAuth();
  const { success: showSuccessToast } = useToast();
  const { roles } = useRoles();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (roleId: string) => {
    setFormData((prev) => ({
      ...prev,
      roles: prev.roles.includes(roleId)
        ? prev.roles.filter((id) => id !== roleId)
        : [...prev.roles, roleId],
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
    if (!formData.email.trim() || !formData.username.trim() || !formData.fullName.trim()) {
      setError('Email, username, and full name are required');
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
        email: formData.email.trim(),
        username: formData.username.trim(),
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        status: formData.status,
        roles: formData.roles,
      };

      const response = await fetch(API_ENDPOINTS.USERS.CREATE, {
        method: 'POST',
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
          message: 'Failed to create user',
        }));
        throw new Error(errorData.message || 'Failed to create user');
      }

      // Success - show toast, reset form and call onSuccess
      showSuccessToast('User created successfully', 'Success');
      setFormData({
        email: '',
        username: '',
        fullName: '',
        phone: '',
        status: 'active',
        roles: [],
      });
      onSuccess();
    } catch (err) {
      console.error('Error creating user:', err);
      setError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h4 className="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90">
        Add New User
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

      {/* Full Name Field */}
      <div>
        <Label htmlFor="fullName">Full Name *</Label>
        <Input
          type="text"
          id="fullName"
          name="fullName"
          placeholder="e.g., John Doe"
          value={formData.fullName}
          onChange={handleChange}
          disabled={isSubmitting}
          required
        />
      </div>

      {/* Email Field */}
      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          type="email"
          id="email"
          name="email"
          placeholder="e.g., user@example.com"
          value={formData.email}
          onChange={handleChange}
          disabled={isSubmitting}
          required
        />
      </div>

      {/* Username Field */}
      <div>
        <Label htmlFor="username">Username *</Label>
        <Input
          type="text"
          id="username"
          name="username"
          placeholder="e.g., john_doe"
          value={formData.username}
          onChange={handleChange}
          disabled={isSubmitting}
          required
        />
      </div>

      {/* Phone Field */}
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          type="text"
          id="phone"
          name="phone"
          placeholder="e.g., +1-555-1234567"
          value={formData.phone}
          onChange={handleChange}
          disabled={isSubmitting}
        />
      </div>

      {/* Status Field */}
      <div>
        <Label htmlFor="status">Status *</Label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          disabled={isSubmitting}
          className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs text-gray-800 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700 dark:focus:border-brand-800"
          required
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Roles Field */}
      <div>
        <Label>Roles</Label>
        <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3 dark:border-gray-700">
          {roles.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No roles available</p>
          ) : (
            roles.map((role) => (
              <label
                key={role._id}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={formData.roles.includes(role._id)}
                  onChange={() => handleRoleChange(role._id)}
                  disabled={isSubmitting}
                  className="rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {role.name}
                </span>
              </label>
            ))
          )}
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
          {isSubmitting ? 'Creating...' : 'Create User'}
        </button>
      </div>
    </form>
  );
}

