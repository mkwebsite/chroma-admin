'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { usePropertyTypes } from '@/hooks/usePropertyTypes';
import PropertyTypesTable from './PropertyTypesTable';
import Button from '@/components/ui/button/Button';
import { Modal } from '@/components/ui/modal';
import { useModal } from '@/hooks/useModal';
import AddPropertyTypeForm from './AddPropertyTypeForm';
import EditPropertyTypeForm from './EditPropertyTypeForm';
import DeletePropertyTypeConfirm from './DeletePropertyTypeConfirm';
import Pagination from '@/components/tables/Pagination';
import { PropertyType } from '@/types/property-type';
import { API_ENDPOINTS } from '@/config/env';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

const ITEMS_PER_PAGE = 10;

export default function PropertyTypesList() {
  const { propertyTypes, isLoading, error, refetch } = usePropertyTypes();
  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isEditOpen, openModal: openEditModal, closeModal: closeEditModal } = useModal();
  const { isOpen: isDeleteOpen, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal();
  const [editingPropertyType, setEditingPropertyType] = useState<PropertyType | null>(null);
  const [deletingPropertyType, setDeletingPropertyType] = useState<PropertyType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { checkAuth } = useAuth();
  const { success: showSuccessToast, error: showErrorToast } = useToast();

  // Calculate pagination
  const totalPages = Math.ceil(propertyTypes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedPropertyTypes = useMemo(
    () => propertyTypes.slice(startIndex, endIndex),
    [propertyTypes, startIndex, endIndex]
  );

  // Reset to page 1 when propertyTypes change
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [propertyTypes.length, currentPage, totalPages]);

  const handlePropertyTypeAdded = () => {
    closeModal();
    refetch();
  };

  const handleEdit = (propertyType: PropertyType) => {
    setEditingPropertyType(propertyType);
    openEditModal();
  };

  const handlePropertyTypeUpdated = () => {
    closeEditModal();
    setEditingPropertyType(null);
    refetch();
  };

  const handleEditCancel = () => {
    closeEditModal();
    setEditingPropertyType(null);
  };

  const handleDelete = (propertyType: PropertyType) => {
    setDeletingPropertyType(propertyType);
    openDeleteModal();
  };

  const handleDeleteConfirm = async () => {
    if (!deletingPropertyType || !checkAuth()) {
      showErrorToast('Not authenticated. Please login again.');
      return;
    }

    setIsDeleting(true);

    try {
      // Get auth token from cookie
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('auth-token='))
        ?.split('=')[1];

      const response = await fetch(API_ENDPOINTS.PROPERTY_TYPES.DELETE(deletingPropertyType._id), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          showErrorToast('Unauthorized. Please login again.');
          return;
        }
        const errorData = await response.json().catch(() => ({
          message: 'Failed to delete property type',
        }));
        throw new Error(errorData.message || 'Failed to delete property type');
      }

      // Success - show toast, close modal and refresh
      showSuccessToast('Property type deleted successfully', 'Success');
      closeDeleteModal();
      setDeletingPropertyType(null);
      refetch();
    } catch (err) {
      console.error('Error deleting property type:', err);
      showErrorToast(err instanceof Error ? err.message : 'Failed to delete property type');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    closeDeleteModal();
    setDeletingPropertyType(null);
  };

  return (
    <div className="space-y-4">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            All Property Types ({propertyTypes.length})
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage property types and their details
            {propertyTypes.length > 0 && (
              <span className="ml-2">
                (Showing {startIndex + 1}-{Math.min(endIndex, propertyTypes.length)} of {propertyTypes.length})
              </span>
            )}
          </p>
        </div>
        <Button size="sm" className="flex items-center gap-2" onClick={openModal}>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Property Type
        </Button>
      </div>

      {/* Add Property Type Modal */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[600px] p-5 lg:p-10"
      >
        <AddPropertyTypeForm onSuccess={handlePropertyTypeAdded} onCancel={closeModal} />
      </Modal>

      {/* Edit Property Type Modal */}
      {editingPropertyType && (
        <Modal
          isOpen={isEditOpen}
          onClose={handleEditCancel}
          className="max-w-[600px] p-5 lg:p-10"
        >
          <EditPropertyTypeForm
            propertyType={editingPropertyType}
            onSuccess={handlePropertyTypeUpdated}
            onCancel={handleEditCancel}
          />
        </Modal>
      )}

      {/* Delete Property Type Confirmation Modal */}
      {deletingPropertyType && (
        <Modal
          isOpen={isDeleteOpen}
          onClose={handleDeleteCancel}
          className="max-w-[500px] p-5 lg:p-10"
        >
          <DeletePropertyTypeConfirm
            propertyType={deletingPropertyType}
            onConfirm={handleDeleteConfirm}
            onCancel={handleDeleteCancel}
            isDeleting={isDeleting}
          />
        </Modal>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800">
          <div className="flex items-center justify-between">
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
            <button
              onClick={refetch}
              className="text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Property Types Table */}
      <PropertyTypesTable
        propertyTypes={paginatedPropertyTypes}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Pagination */}
      {propertyTypes.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-white/[0.05]">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}

