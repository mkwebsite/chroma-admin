'use client';

import React, { useState } from 'react';
import { API_ENDPOINTS } from '@/config/env';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import Button from '@/components/ui/button/Button';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import TextArea from '@/components/form/input/TextArea';
import { ChevronDownIcon } from '@/icons';

interface AddFacilityFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddFacilityForm({ onSuccess, onCancel }: AddFacilityFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
  });

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { checkAuth } = useAuth();
  const { success: showSuccessToast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      description: value,
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
        description: formData.description.trim() || undefined,
        status: formData.status,
      };

      const response = await fetch(API_ENDPOINTS.FACILITIES.CREATE, {
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
          message: 'Failed to create facility',
        }));
        throw new Error(errorData.message || 'Failed to create facility');
      }

      // Success - show toast and call onSuccess
      showSuccessToast('Facility created successfully', 'Success');
      onSuccess();
    } catch (err) {
      console.error('Error creating facility:', err);
      setError(err instanceof Error ? err.message : 'Failed to create facility');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">
          Add Facility
        </h3>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">
            Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter facility name"
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <TextArea
            value={formData.description}
            onChange={handleDescriptionChange}
            placeholder="Enter description"
            rows={4}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
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
      </div>

      <div className="flex items-center justify-end w-full gap-3 pt-4 border-t border-gray-200 dark:border-white/[0.05]">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Facility'}
        </Button>
      </div>
    </form>
  );
}

