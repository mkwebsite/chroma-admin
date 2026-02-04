'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import RolePermissionsTable from '@/components/role-permissions/RolePermissionsTable';
import { useRolePermissions } from '@/hooks/useRolePermissions';
import { useRoles } from '@/hooks/useRoles';
import Button from '@/components/ui/button/Button';

export default function RolePermissionsPage() {
  const params = useParams();
  const router = useRouter();
  const roleId = params?.roleId as string;
  const { rolePermissions, isLoading, error } = useRolePermissions(roleId);
  const { roles } = useRoles();
  const [roleName, setRoleName] = useState<string>('Role');

  useEffect(() => {
    if (roleId && roles.length > 0) {
      const role = roles.find((r) => r._id === roleId);
      if (role) {
        setRoleName(role.name);
      }
    }
  }, [roleId, roles]);

  const handleGoBack = () => {
    router.push('/admin/roles');
  };

  return (
    <div>
      <PageBreadcrumb pageTitle={`${roleName} - Permissions`} />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
              Role Permissions: {roleName}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              View all permissions assigned to this role
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={handleGoBack}>
            Back to Roles
          </Button>
        </div>

        <ComponentCard title="Role Permissions List">
          {error && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800 mb-4">
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
          <RolePermissionsTable rolePermissions={rolePermissions} isLoading={isLoading} />
        </ComponentCard>
      </div>
    </div>
  );
}

