'use client';

import React from 'react';
import { EventType } from '@/types/event-type';
import Button from '@/components/ui/button/Button';

interface DeleteEventTypeConfirmProps {
  eventType: EventType;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export default function DeleteEventTypeConfirm({
  eventType,
  onConfirm,
  onCancel,
  isDeleting = false,
}: DeleteEventTypeConfirmProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-error-50 dark:bg-error-500/15 mb-6">
          <svg
            className="h-8 w-8 text-error-600 dark:text-error-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h4 className="font-semibold text-gray-800 mb-2 text-title-sm dark:text-white/90">
          Delete Event Type
        </h4>
        <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
          Are you sure you want to delete the event type{' '}
          <span className="font-semibold text-gray-800 dark:text-white/90">
            "{eventType.name}"
          </span>
          ? This action cannot be undone.
        </p>
      </div>

      <div className="flex items-center justify-end w-full gap-3 mt-6">
        <Button
          size="sm"
          variant="outline"
          onClick={onCancel}
          disabled={isDeleting}
        >
          Cancel
        </Button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isDeleting}
          className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-error-500 text-white shadow-theme-xs hover:bg-error-600 disabled:bg-error-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isDeleting ? 'Deleting...' : 'Delete Event Type'}
        </button>
      </div>
    </div>
  );
}

