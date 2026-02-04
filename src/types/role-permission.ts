/**
 * Role Permission type definitions
 */

export interface RolePermission {
  _id: string;
  role_id: string;
  module: string;
  permission: string;
  menu_id: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface RolePermissionFormData {
  role_id: string;
  module: string;
  permission: string;
  menu_id: string;
}

