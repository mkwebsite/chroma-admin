/**
 * Property Type type definitions
 */

export interface PropertyType {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface PropertyTypeFormData {
  name: string;
  description?: string;
  status?: string;
}

