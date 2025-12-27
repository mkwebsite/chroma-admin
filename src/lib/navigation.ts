/**
 * Navigation utilities for type-safe routing
 */

import { ROUTES } from '@/config/routes';
import { useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';

/**
 * Custom hook for type-safe navigation
 */
export function useAppRouter() {
  const router = useRouter();
  const pathname = usePathname();

  const navigate = useCallback((path: string) => {
    router.push(path);
  }, [router]);

  const replace = useCallback((path: string) => {
    router.replace(path);
  }, [router]);

  const goBack = useCallback(() => {
    router.back();
  }, [router]);

  const goForward = useCallback(() => {
    router.forward();
  }, [router]);

  const refresh = useCallback(() => {
    router.refresh();
  }, [router]);

  return {
    // Current route info
    pathname,
    
    // Navigation methods
    navigate,
    replace,
    goBack,
    goForward,
    refresh,
    
    // Convenience methods
    goToSignIn: () => navigate(ROUTES.AUTH.SIGNIN),
    goToSignUp: () => navigate(ROUTES.AUTH.SIGNUP),
    goToDashboard: () => navigate(ROUTES.DASHBOARD_HOME),
    goToProfile: () => navigate(ROUTES.PROFILE),
    goToHome: () => navigate(ROUTES.HOME),
  };
}

/**
 * Check if current pathname matches a route
 */
export function isActiveRoute(pathname: string, route: string): boolean {
  if (route === ROUTES.HOME) {
    return pathname === ROUTES.HOME;
  }
  return pathname.startsWith(route);
}

/**
 * Get route parameters from pathname
 */
export function getRouteParams(pathname: string, routePattern: string): Record<string, string> {
  const params: Record<string, string> = {};
  const patternParts = routePattern.split('/');
  const pathParts = pathname.split('/');

  patternParts.forEach((part, index) => {
    if (part.startsWith('[') && part.endsWith(']')) {
      const paramName = part.slice(1, -1);
      params[paramName] = pathParts[index] || '';
    }
  });

  return params;
}

