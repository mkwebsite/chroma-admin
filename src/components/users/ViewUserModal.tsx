'use client';

import React from 'react';
import { User } from '@/types/user';
import Button from '@/components/ui/button/Button';

interface ViewUserModalProps {
  user: User;
  onClose: () => void;
}

export default function ViewUserModal({ user, onClose }: ViewUserModalProps) {
  return (
    <div className="space-y-6">
      <h4 className="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90">
        User Details
      </h4>

      <div className="space-y-4">
        {/* Profile Photo */}
        <div className="flex items-center justify-center mb-6">
          {user.profilePhoto ? (
            <img
              src={user.profilePhoto}
              alt={user.fullName}
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-3xl font-medium text-gray-600 dark:text-gray-300">
                {user.fullName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1.5">
            Full Name
          </label>
          <p className="text-sm text-gray-800 dark:text-white/90">{user.fullName}</p>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1.5">
            Email
          </label>
          <p className="text-sm text-gray-800 dark:text-white/90">{user.email}</p>
          {user.emailVerified && (
            <span className="inline-flex items-center mt-1 text-xs text-success-600 dark:text-success-400">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Verified
            </span>
          )}
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1.5">
            Username
          </label>
          <p className="text-sm text-gray-800 dark:text-white/90">{user.username}</p>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1.5">
            Phone
          </label>
          <p className="text-sm text-gray-800 dark:text-white/90">{user.phone || '-'}</p>
          {user.phoneVerified && (
            <span className="inline-flex items-center mt-1 text-xs text-success-600 dark:text-success-400">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Verified
            </span>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1.5">
            Status
          </label>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              user.status === 'active'
                ? 'bg-success-100 text-success-800 dark:bg-success-500/20 dark:text-success-400'
                : user.status === 'inactive'
                ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                : 'bg-error-100 text-error-800 dark:bg-error-500/20 dark:text-error-400'
            }`}
          >
            {user.status}
          </span>
        </div>

        {/* Roles */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1.5">
            Roles
          </label>
          <div className="flex flex-wrap gap-2">
            {user.roles && user.roles.length > 0 ? (
              user.roles.map((role, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                >
                  {role.name}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-500 dark:text-gray-400">No roles assigned</span>
            )}
          </div>
        </div>

        {/* Created At */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1.5">
            Created At
          </label>
          <p className="text-sm text-gray-800 dark:text-white/90">
            {new Date(user.createdAt).toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>

        {/* Updated At */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1.5">
            Last Updated
          </label>
          <p className="text-sm text-gray-800 dark:text-white/90">
            {new Date(user.updatedAt).toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>

      {/* Close Button */}
      <div className="flex items-center justify-end w-full gap-3 mt-6">
        <Button size="sm" variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}

