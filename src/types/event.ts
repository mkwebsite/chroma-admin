/**
 * Event type definitions
 */

export interface Event {
  _id: string;
  name: string;
  slug: string;
  event_type_id: string;
  description?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface EventFormData {
  name: string;
  event_type_id: string;
  description?: string;
  status?: string;
}

