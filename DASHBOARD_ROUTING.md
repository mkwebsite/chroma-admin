# Dashboard Router Management Guide

## Overview

The dashboard routing system provides centralized management for all dashboard-related routes and navigation.

## Route Structure

### Main Dashboard Routes

- **`/`** - Main dashboard (home page) - `ROUTES.DASHBOARD_HOME`
- **`/dashboard`** - Dashboard alias (redirects to `/`) - `ROUTES.DASHBOARD`

### Dashboard Sub-Routes

All dashboard sub-routes are accessible directly:

- `/calendar` - Calendar page
- `/profile` - User profile
- `/form-elements` - Form elements
- `/basic-tables` - Basic tables
- `/line-chart` - Line chart
- `/bar-chart` - Bar chart
- `/alerts` - Alerts UI
- `/avatars` - Avatars UI
- `/badge` - Badge UI
- `/buttons` - Buttons UI
- `/images` - Images UI
- `/videos` - Videos UI
- `/modals` - Modals UI
- `/blank` - Blank page
- `/error-404` - 404 error page

## Usage

### 1. Using Dashboard Router Hook

```tsx
'use client';
import { useDashboardRouter } from '@/lib/dashboard-router';

export default function MyComponent() {
  const { 
    navigateToDashboard, 
    navigateToDashboardSection,
    isOnDashboard,
    currentPath 
  } = useDashboardRouter();

  return (
    <div>
      <button onClick={navigateToDashboard}>
        Go to Dashboard
      </button>
      <button onClick={() => navigateToDashboardSection('/calendar')}>
        Go to Calendar
      </button>
      {isOnDashboard() && <p>You're on the dashboard!</p>}
    </div>
  );
}
```

### 2. Using Route Constants

```tsx
import { ROUTES } from '@/config/routes';
import { DASHBOARD_ROUTES } from '@/lib/dashboard-router';
import Link from 'next/link';

// Using main routes
<Link href={ROUTES.DASHBOARD_HOME}>Dashboard</Link>
<Link href={ROUTES.DASHBOARD}>Dashboard (alias)</Link>

// Using dashboard routes
<Link href={DASHBOARD_ROUTES.HOME}>Home</Link>
<Link href={DASHBOARD_ROUTES.CALENDAR}>Calendar</Link>
<Link href={DASHBOARD_ROUTES.CHARTS.LINE}>Line Chart</Link>
```

### 3. Using Navigation Utilities

```tsx
import { useAppRouter } from '@/lib/navigation';

export default function MyComponent() {
  const router = useAppRouter();

  return (
    <button onClick={router.goToDashboard}>
      Go to Dashboard
    </button>
  );
}
```

### 4. Breadcrumb Generation

```tsx
import { getDashboardBreadcrumb } from '@/lib/dashboard-router';
import { usePathname } from 'next/navigation';

export default function Breadcrumb() {
  const pathname = usePathname();
  const breadcrumbs = getDashboardBreadcrumb(pathname);

  return (
    <nav>
      {breadcrumbs.map((crumb, index) => (
        <span key={index}>
          {index > 0 && ' / '}
          {crumb}
        </span>
      ))}
    </nav>
  );
}
```

### 5. Route Checking

```tsx
import { isDashboardRoute, isDashboardSubRoute } from '@/lib/dashboard-router';
import { usePathname } from 'next/navigation';

export default function MyComponent() {
  const pathname = usePathname();
  
  const isDashboard = isDashboardRoute(pathname);
  const isSubRoute = isDashboardSubRoute(pathname);

  return (
    <div>
      {isDashboard && <p>On main dashboard</p>}
      {isSubRoute && <p>On dashboard sub-route</p>}
    </div>
  );
}
```

## Route Configuration

### Adding New Dashboard Routes

1. **Add to `src/config/routes.ts`:**
```ts
export const ROUTES = {
  // ... existing routes
  DASHBOARD: {
    NEW_SECTION: '/new-section',
  },
} as const;
```

2. **Update `src/lib/dashboard-router.ts`:**
```ts
export const DASHBOARD_ROUTES = {
  // ... existing routes
  NEW_SECTION: ROUTES.DASHBOARD.NEW_SECTION,
} as const;
```

3. **Create the page:**
```
src/app/new-section/page.tsx
```

4. **Update middleware (if needed):**
```ts
// middleware.ts
const protectedRoutes = [
  // ... existing routes
  '/new-section',
];
```

## Route Protection

All dashboard routes are automatically protected:

1. **Middleware** - Server-side protection (checks for auth token)
2. **ProtectedRoute** - Client-side protection (wraps admin layout)

## Navigation Patterns

### Pattern 1: Direct Navigation

```tsx
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/config/routes';

const router = useRouter();
router.push(ROUTES.DASHBOARD_HOME);
```

### Pattern 2: Using Hook

```tsx
import { useDashboardRouter } from '@/lib/dashboard-router';

const { navigateToDashboard } = useDashboardRouter();
navigateToDashboard();
```

### Pattern 3: Conditional Navigation

```tsx
import { useDashboardRouter } from '@/lib/dashboard-router';
import { useAuth } from '@/context/AuthContext';

export default function ConditionalNav() {
  const { user } = useAuth();
  const { navigateToDashboardSection } = useDashboardRouter();

  useEffect(() => {
    if (user?.role === 'admin') {
      navigateToDashboardSection('/admin-panel');
    } else {
      navigateToDashboardSection('/user-dashboard');
    }
  }, [user]);
}
```

## Route Aliases

The dashboard supports route aliases for better UX:

- `/dashboard` → `/` (main dashboard)
- Both routes work and redirect appropriately

## Best Practices

1. **Always use route constants** - Don't hardcode route strings
2. **Use hooks for navigation** - `useDashboardRouter()` or `useAppRouter()`
3. **Check route state** - Use `isOnDashboard()` before rendering dashboard-specific UI
4. **Use breadcrumbs** - Implement breadcrumb navigation for better UX
5. **Protect routes** - All dashboard routes should be in protected routes list

## Troubleshooting

### Issue: Dashboard route not working
- Check that route is in `protectedRoutes` in `middleware.ts`
- Verify route exists in `src/config/routes.ts`
- Ensure page file exists in `src/app/`

### Issue: Navigation not working
- Verify you're using the hook or router correctly
- Check that route constant is imported
- Ensure route is defined in `ROUTES` object

### Issue: Breadcrumbs not showing
- Verify `getDashboardBreadcrumb()` is called with current pathname
- Check that route is recognized as dashboard sub-route

## Summary

- ✅ Centralized dashboard routing
- ✅ Type-safe route constants
- ✅ Navigation hooks and utilities
- ✅ Breadcrumb generation
- ✅ Route checking functions
- ✅ Automatic route protection
- ✅ Route aliases support

