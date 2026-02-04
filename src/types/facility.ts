/**
 * Facility type definitions
 */

export interface Facility {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface FacilityFormData {
  name: string;
  description?: string;
  status?: string;
}

