/**
 * Centralized route configuration
 * Use these constants instead of hardcoding route strings throughout the app
 */

export const ROUTES = {
  HOME: '/',
  
  // Authentication routes
  AUTH: {
    SIGNIN: '/auth/signin',
    SIGNUP: '/auth/signup',
    RESET_PASSWORD: '/auth/reset-password',
    FORGOT_PASSWORD: '/auth/forgot-password',
  },
  
  // Dashboard routes
  DASHBOARD: '/dashboard',
  DASHBOARD_HOME: '/', // Main dashboard (home page)
  
  // Profile routes
  PROFILE: '/admin/profile',
  
  // Calendar
  CALENDAR: '/admin/calendar',
  
  // Forms
  FORMS: {
    ELEMENTS: '/admin/form-elements',
  },
  
  // Tables
  TABLES: {
    BASIC: '/admin/basic-tables',
  },
  
  // Pages
  PAGES: {
    BLANK: '/admin/blank',
    ERROR_404: '/error-404',
  },
  
  // Charts
  CHARTS: {
    LINE: '/admin/line-chart',
    BAR: '/admin/bar-chart',
  },
  
  // UI Elements
  UI: {
    ALERTS: '/admin/alerts',
    AVATARS: '/admin/avatars',
    BADGE: '/admin/badge',
    BUTTONS: '/admin/buttons',
    IMAGES: '/images',
    VIDEOS: '/admin/videos',
    MODALS: '/admin/modals',
  },
  
  // Roles
  ROLES: '/admin/roles',
  ROLE_PERMISSIONS: (roleId: string) => `/admin/roles/${roleId}/permissions`,
  
  // Users
  USERS: '/admin/users',
  
  // Menus
  MENUS: '/admin/menus',
  
  // Menu Routes
  MENU_ROUTES: '/admin/menu-routes',
  
  // Event Types
  EVENT_TYPES: '/admin/event-types',
  
  // Events
  EVENTS: '/admin/events',
  
  // Property Types
  PROPERTY_TYPES: '/admin/property-types',
  
  // Facilities
  FACILITIES: '/admin/facilities',
  
  // Room Types
  ROOM_TYPES: '/admin/room-types',
} as const;

/**
 * Helper function to check if a route is an auth route
 */
export function isAuthRoute(pathname: string): boolean {
  return pathname.startsWith('/auth');
}

/**
 * Helper function to check if a route is a protected route
 */
export function isProtectedRoute(pathname: string): boolean {
  const protectedRoutes = [
    ROUTES.DASHBOARD,
    ROUTES.PROFILE,
    ROUTES.CALENDAR,
  ];
  
  return protectedRoutes.some(route => pathname.startsWith(route));
}

/**
 * Get redirect URL after login based on user role or previous page
 */
export function getPostLoginRedirect(returnUrl?: string): string {
  if (returnUrl && !isAuthRoute(returnUrl)) {
    return returnUrl;
  }
  return ROUTES.DASHBOARD_HOME;
}

/**
 * Check if a route is a dashboard route
 */
export function isDashboardRoute(pathname: string): boolean {
  return pathname === ROUTES.DASHBOARD || pathname === ROUTES.DASHBOARD_HOME;
}

