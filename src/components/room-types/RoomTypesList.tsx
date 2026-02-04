'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRoomTypes } from '@/hooks/useRoomTypes';
import RoomTypesTable from './RoomTypesTable';
import Button from '@/components/ui/button/Button';
import { Modal } from '@/components/ui/modal';
import { useModal } from '@/hooks/useModal';
import AddRoomTypeForm from './AddRoomTypeForm';
import EditRoomTypeForm from './EditRoomTypeForm';
import DeleteRoomTypeConfirm from './DeleteRoomTypeConfirm';
import Pagination from '@/components/tables/Pagination';
import { RoomType } from '@/types/room-type';
import { API_ENDPOINTS } from '@/config/env';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

const ITEMS_PER_PAGE = 10;

export default function RoomTypesList() {
  const { roomTypes, isLoading, error, refetch } = useRoomTypes();
  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isEditOpen, openModal: openEditModal, closeModal: closeEditModal } = useModal();
  const { isOpen: isDeleteOpen, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal();
  const [editingRoomType, setEditingRoomType] = useState<RoomType | null>(null);
  const [deletingRoomType, setDeletingRoomType] = useState<RoomType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { checkAuth } = useAuth();
  const { success: showSuccessToast, error: showErrorToast } = useToast();

  // Calculate pagination
  const totalPages = Math.ceil(roomTypes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedRoomTypes = useMemo(
    () => roomTypes.slice(startIndex, endIndex),
    [roomTypes, startIndex, endIndex]
  );

  // Reset to page 1 when roomTypes change
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [roomTypes.length, currentPage, totalPages]);

  const handleRoomTypeAdded = () => {
    closeModal();
    refetch();
  };

  const handleEdit = (roomType: RoomType) => {
    setEditingRoomType(roomType);
    openEditModal();
  };

  const handleRoomTypeUpdated = () => {
    closeEditModal();
    setEditingRoomType(null);
    refetch();
  };

  const handleEditCancel = () => {
    closeEditModal();
    setEditingRoomType(null);
  };

  const handleDelete = (roomType: RoomType) => {
    setDeletingRoomType(roomType);
    openDeleteModal();
  };

  const handleDeleteConfirm = async () => {
    if (!deletingRoomType || !checkAuth()) {
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

      const response = await fetch(API_ENDPOINTS.ROOM_TYPES.DELETE(deletingRoomType._id), {
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
          message: 'Failed to delete room type',
        }));
        throw new Error(errorData.message || 'Failed to delete room type');
      }

      // Success - show toast, close modal and refresh
      showSuccessToast('Room type deleted successfully', 'Success');
      closeDeleteModal();
      setDeletingRoomType(null);
      refetch();
    } catch (err) {
      console.error('Error deleting room type:', err);
      showErrorToast(err instanceof Error ? err.message : 'Failed to delete room type');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    closeDeleteModal();
    setDeletingRoomType(null);
  };

  return (
    <div className="space-y-4">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            All Room Types ({roomTypes.length})
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage room types and their details
            {roomTypes.length > 0 && (
              <span className="ml-2">
                (Showing {startIndex + 1}-{Math.min(endIndex, roomTypes.length)} of {roomTypes.length})
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
          Add Room Type
        </Button>
      </div>

      {/* Add Room Type Modal */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[600px] p-5 lg:p-10"
      >
        <AddRoomTypeForm onSuccess={handleRoomTypeAdded} onCancel={closeModal} />
      </Modal>

      {/* Edit Room Type Modal */}
      {editingRoomType && (
        <Modal
          isOpen={isEditOpen}
          onClose={handleEditCancel}
          className="max-w-[600px] p-5 lg:p-10"
        >
          <EditRoomTypeForm
            roomType={editingRoomType}
            onSuccess={handleRoomTypeUpdated}
            onCancel={handleEditCancel}
          />
        </Modal>
      )}

      {/* Delete Room Type Confirmation Modal */}
      {deletingRoomType && (
        <Modal
          isOpen={isDeleteOpen}
          onClose={handleDeleteCancel}
          className="max-w-[500px] p-5 lg:p-10"
        >
          <DeleteRoomTypeConfirm
            roomType={deletingRoomType}
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

      {/* Room Types Table */}
      <RoomTypesTable
        roomTypes={paginatedRoomTypes}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Pagination */}
      {roomTypes.length > 0 && totalPages > 1 && (
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

