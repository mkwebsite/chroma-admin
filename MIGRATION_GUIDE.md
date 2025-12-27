# Migration Guide: Using Custom Router Utilities

## Quick Start

### 1. Import Route Constants
Instead of hardcoding routes, use the centralized constants:

```tsx
// ❌ Before
<Link href="/auth/signin">Sign In</Link>

// ✅ After
import { ROUTES } from '@/config/routes';
<Link href={ROUTES.AUTH.SIGNIN}>Sign In</Link>
```

### 2. Use Navigation Hook
For programmatic navigation:

```tsx
// ❌ Before
import { useRouter } from 'next/navigation';
const router = useRouter();
router.push('/auth/signin');

// ✅ After
import { useAppRouter } from '@/lib/navigation';
const router = useAppRouter();
router.goToSignIn(); // Type-safe and cleaner
```

### 3. Update Existing Components

#### Example: Update SignInForm.tsx
```tsx
// Before
import Link from 'next/link';
<Link href="/signup">Sign Up</Link>

// After
import { ROUTES } from '@/config/routes';
<Link href={ROUTES.AUTH.SIGNUP}>Sign Up</Link>
```

#### Example: Update AppSidebar.tsx
```tsx
// Before
const navItems = [
  { name: "Sign In", path: "/auth/signin", pro: false },
];

// After
import { ROUTES } from '@/config/routes';
const navItems = [
  { name: "Sign In", path: ROUTES.AUTH.SIGNIN, pro: false },
];
```

#### Example: Update UserDropdown.tsx
```tsx
// Before
import Link from 'next/link';
<Link href="/auth/signin">Sign out</Link>

// After
import { ROUTES } from '@/config/routes';
<Link href={ROUTES.AUTH.SIGNIN}>Sign out</Link>
```

### 4. Using Middleware for Route Protection

The middleware is already set up in `middleware.ts`. It will:
- Redirect unauthenticated users from protected routes to `/auth/signin`
- Redirect authenticated users away from auth pages

To customize, edit `middleware.ts` and adjust:
- Protected routes list
- Auth routes list
- Cookie name for auth token

### 5. Adding New Routes

1. Add route to `src/config/routes.ts`:
```ts
export const ROUTES = {
  // ... existing routes
  NEW_SECTION: {
    NEW_PAGE: '/new-section/new-page',
  },
};
```

2. Create the page:
```
src/app/new-section/new-page/page.tsx
```

3. Use the route constant:
```tsx
import { ROUTES } from '@/config/routes';
router.navigate(ROUTES.NEW_SECTION.NEW_PAGE);
```

## Benefits

✅ **Type Safety**: TypeScript will catch typos in route names  
✅ **Centralized**: Change a route in one place, updates everywhere  
✅ **Autocomplete**: IDE autocomplete for all routes  
✅ **Refactoring**: Easy to rename routes across the app  
✅ **Consistency**: All routes follow the same pattern  

## Common Patterns

### Conditional Navigation
```tsx
const router = useAppRouter();

if (user.role === 'admin') {
  router.navigate('/admin/dashboard');
} else {
  router.navigate('/user/dashboard');
}
```

### Navigation with Query Params
```tsx
const router = useRouter(); // Still use Next.js router for complex cases
router.push(`${ROUTES.DASHBOARD}?tab=settings`);
```

### Check Active Route
```tsx
import { isActiveRoute } from '@/lib/navigation';
import { ROUTES } from '@/config/routes';

const isDashboardActive = isActiveRoute(pathname, ROUTES.DASHBOARD);
```

