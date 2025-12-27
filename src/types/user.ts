/**
 * User type definitions
 */

import { Role } from './role';

export interface User {
  _id: string;
  is_deleted: boolean;
  status: 'active' | 'inactive' | 'suspended';
  email: string;
  username: string;
  roles: Role[];
  fullName: string;
  phone: string;
  profilePhoto?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface UserFormData {
  email: string;
  username: string;
  fullName: string;
  phone: string;
  status: 'active' | 'inactive' | 'suspended';
  roles?: string[];
}

