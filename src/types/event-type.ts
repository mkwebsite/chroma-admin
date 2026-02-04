/**
 * Event Type type definitions
 */

export interface EventType {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface EventTypeFormData {
  name: string;
  slug?: string; // Made optional as it's auto-generated
  description?: string;
  status?: string;
}

