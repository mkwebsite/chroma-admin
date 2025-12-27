/**
 * Role type definitions
 */

export interface Role {
  _id: string;
  name: string;
  slug: string;
  description: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface RoleFormData {
  name: string;
  slug: string;
  description: string;
  permissions: string[];
}

