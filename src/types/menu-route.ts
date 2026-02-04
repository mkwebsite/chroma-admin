/**
 * Menu Route type definitions
 */

export interface MenuRoute {
  _id: string;
  name: string;
  url: string;
  key?: string;
  menu_id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface MenuRouteFormData {
  name: string;
  url: string;
  menu_id: string;
  status?: string;
}

