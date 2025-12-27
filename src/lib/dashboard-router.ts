/**
 * Dashboard Router Utilities
 * Centralized dashboard routing logic and navigation helpers
 */

import { ROUTES } from '@/config/routes';
import { useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';

/**
 * Custom hook for dashboard navigation
 */
export function useDashboardRouter() {
  const router = useRouter();
  const pathname = usePathname();

  const navigateToDashboard = useCallback(() => {
    router.push(ROUTES.DASHBOARD_HOME);
  }, [router]);

  const navigateToDashboardSection = useCallback((section: string) => {
    router.push(`${ROUTES.DASHBOARD_HOME}${section}`);
  }, [router]);

  const isOnDashboard = useCallback(() => {
    return pathname === ROUTES.DASHBOARD_HOME || pathname === ROUTES.DASHBOARD;
  }, [pathname]);

  return {
    navigateToDashboard,
    navigateToDashboardSection,
    isOnDashboard,
    currentPath: pathname,
  };
}

/**
 * Dashboard route configuration
 */
export const DASHBOARD_ROUTES = {
  HOME: ROUTES.DASHBOARD_HOME,
  MAIN: ROUTES.DASHBOARD,
  CALENDAR: ROUTES.CALENDAR,
  PROFILE: ROUTES.PROFILE,
  FORMS: ROUTES.FORMS.ELEMENTS,
  TABLES: ROUTES.TABLES.BASIC,
  CHARTS: {
    LINE: ROUTES.CHARTS.LINE,
    BAR: ROUTES.CHARTS.BAR,
  },
  UI: {
    ALERTS: ROUTES.UI.ALERTS,
    AVATARS: ROUTES.UI.AVATARS,
    BADGE: ROUTES.UI.BADGE,
    BUTTONS: ROUTES.UI.BUTTONS,
    IMAGES: ROUTES.UI.IMAGES,
    VIDEOS: ROUTES.UI.VIDEOS,
    MODALS: ROUTES.UI.MODALS,
  },
  PAGES: {
    BLANK: ROUTES.PAGES.BLANK,
    ERROR_404: ROUTES.PAGES.ERROR_404,
  },
} as const;

/**
 * Get dashboard breadcrumb path
 */
export function getDashboardBreadcrumb(pathname: string): string[] {
  const breadcrumbs: string[] = ['Dashboard'];
  
  if (pathname === ROUTES.DASHBOARD_HOME || pathname === ROUTES.DASHBOARD) {
    return breadcrumbs;
  }

  // Extract section name from path
  const sections = pathname.split('/').filter(Boolean);
  
  if (sections.length > 0) {
    const section = sections[0];
    // Capitalize first letter and replace hyphens with spaces
    const formatted = section
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    breadcrumbs.push(formatted);
  }

  return breadcrumbs;
}

/**
 * Check if current route is a dashboard sub-route
 */
export function isDashboardSubRoute(pathname: string): boolean {
  const dashboardRoutes = [
    ROUTES.DASHBOARD_HOME,
    ROUTES.DASHBOARD,
    ROUTES.CALENDAR,
    ROUTES.PROFILE,
    ROUTES.FORMS.ELEMENTS,
    ROUTES.TABLES.BASIC,
    ROUTES.CHARTS.LINE,
    ROUTES.CHARTS.BAR,
    ROUTES.UI.ALERTS,
    ROUTES.UI.AVATARS,
    ROUTES.UI.BADGE,
    ROUTES.UI.BUTTONS,
    ROUTES.UI.IMAGES,
    ROUTES.UI.VIDEOS,
    ROUTES.UI.MODALS,
    ROUTES.PAGES.BLANK,
    ROUTES.PAGES.ERROR_404,
  ];

  return dashboardRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));
}

