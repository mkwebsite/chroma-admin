/**
 * Menu type definitions
 */

export interface Menu {
  _id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface MenuFormData {
  name: string;
  status?: string;
}

