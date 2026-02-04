/**
 * Room Type type definitions
 */

export interface RoomType {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface RoomTypeFormData {
  name: string;
  description?: string;
  status?: string;
}

