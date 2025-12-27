# Next.js Custom Router Management Guide

## Table of Contents
1. [Next.js App Router Basics](#nextjs-app-router-basics)
2. [Route Organization](#route-organization)
3. [Custom Redirects](#custom-redirects)
4. [Route Protection with Middleware](#route-protection-with-middleware)
5. [Dynamic Routes](#dynamic-routes)
6. [Route Groups](#route-groups)
7. [API Routes](#api-routes)
8. [Best Practices](#best-practices)

---

## Next.js App Router Basics

Next.js uses a **file-based routing system** where the folder structure in `src/app` determines your routes.

### Basic Route Structure
```
src/app/
├── page.tsx              → / (home page)
├── layout.tsx            → Root layout
├── about/
│   └── page.tsx         → /about
├── auth/
│   ├── layout.tsx       → Layout for all /auth/* routes
│   ├── signin/
│   │   └── page.tsx     → /auth/signin
│   └── signup/
│       └── page.tsx     → /auth/signup
└── dashboard/
    └── [id]/
        └── page.tsx     → /dashboard/:id (dynamic)
```

---

## Route Organization

### 1. **Route Segments**
Each folder represents a route segment:
- `app/dashboard/page.tsx` → `/dashboard`
- `app/dashboard/settings/page.tsx` → `/dashboard/settings`

### 2. **Layouts**
Layouts wrap routes and persist across navigation:
```tsx
// app/auth/layout.tsx
export default function AuthLayout({ children }) {
  return (
    <div className="auth-container">
      {children}
    </div>
  );
}
```

### 3. **Nested Layouts**
Layouts can be nested:
```
app/
├── layout.tsx           → Root layout
└── dashboard/
    ├── layout.tsx       → Dashboard layout (nested)
    └── page.tsx
```

---

## Custom Redirects

### Method 1: Using `redirect()` in Page Component
```tsx
// app/old-route/page.tsx
import { redirect } from 'next/navigation';

export default function OldRoute() {
  redirect('/new-route');
}
```

### Method 2: Using `next.config.ts` Rewrites
```ts
// next.config.ts
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/old-path',
        destination: '/new-path',
        permanent: true, // 308 redirect
      },
      {
        source: '/signin',
        destination: '/auth/signin',
        permanent: false, // 307 redirect
      },
    ];
  },
};
```

### Method 3: Using `next.config.ts` Rewrites (URL masking)
```ts
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/v1/:path*', // URL stays the same
      },
    ];
  },
};
```

---

## Route Protection with Middleware

Create `middleware.ts` in the root directory:

```ts
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');
  const { pathname } = request.nextUrl;

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  // Redirect authenticated users away from auth pages
  if (pathname.startsWith('/auth') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/:path*',
    '/profile/:path*',
  ],
};
```

---

## Dynamic Routes

### Single Dynamic Segment
```tsx
// app/users/[id]/page.tsx
export default function UserPage({ params }: { params: { id: string } }) {
  return <div>User ID: {params.id}</div>;
}
```

### Multiple Dynamic Segments
```tsx
// app/shop/[category]/[product]/page.tsx
export default function ProductPage({ 
  params 
}: { 
  params: { category: string; product: string } 
}) {
  return (
    <div>
      Category: {params.category}
      Product: {params.product}
    </div>
  );
}
```

### Catch-All Routes
```tsx
// app/docs/[...slug]/page.tsx
export default function DocsPage({ 
  params 
}: { 
  params: { slug: string[] } 
}) {
  return <div>Docs: {params.slug.join('/')}</div>;
}
// Matches: /docs/a, /docs/a/b, /docs/a/b/c, etc.
```

### Optional Catch-All Routes
```tsx
// app/shop/[[...slug]]/page.tsx
// Matches: /shop AND /shop/category/product
```

---

## Route Groups

Route groups (folders with parentheses) organize routes without affecting the URL:

```
app/
├── (marketing)/
│   ├── layout.tsx       → Marketing layout
│   ├── about/
│   │   └── page.tsx     → /about (not /marketing/about)
│   └── contact/
│       └── page.tsx     → /contact
└── (dashboard)/
    ├── layout.tsx       → Dashboard layout
    └── settings/
        └── page.tsx     → /settings
```

---

## API Routes

### Route Handlers
```tsx
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const users = await fetchUsers();
  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const user = await createUser(body);
  return NextResponse.json(user, { status: 201 });
}
```

### Dynamic API Routes
```tsx
// app/api/users/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUserById(params.id);
  return NextResponse.json(user);
}
```

---

## Best Practices

### 1. **Centralize Route Constants**
```ts
// src/config/routes.ts
export const ROUTES = {
  HOME: '/',
  AUTH: {
    SIGNIN: '/auth/signin',
    SIGNUP: '/auth/signup',
    RESET_PASSWORD: '/auth/reset-password',
  },
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
} as const;
```

### 2. **Use Type-Safe Navigation**
```tsx
// src/lib/navigation.ts
import { ROUTES } from '@/config/routes';
import { useRouter } from 'next/navigation';

export function useAppRouter() {
  const router = useRouter();
  
  return {
    goToSignIn: () => router.push(ROUTES.AUTH.SIGNIN),
    goToDashboard: () => router.push(ROUTES.DASHBOARD),
    goBack: () => router.back(),
  };
}
```

### 3. **Route Protection Pattern**
```tsx
// src/components/auth/ProtectedRoute.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return null;

  return <>{children}</>;
}
```

### 4. **404 Handling**
```tsx
// app/not-found.tsx
export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/">Return Home</Link>
    </div>
  );
}
```

### 5. **Loading States**
```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return <div>Loading dashboard...</div>;
}
```

### 6. **Error Boundaries**
```tsx
// app/dashboard/error.tsx
'use client';
export default function Error({ error, reset }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

---

## Common Patterns

### Pattern 1: Route Aliases
```tsx
// app/login/page.tsx
import { redirect } from 'next/navigation';
export default function Login() {
  redirect('/auth/signin');
}
```

### Pattern 2: Conditional Routing
```tsx
// app/dashboard/page.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function Dashboard() {
  const { user, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (role === 'admin') {
      router.push('/admin/dashboard');
    } else if (role === 'user') {
      router.push('/user/dashboard');
    }
  }, [role, router]);

  return <div>Dashboard</div>;
}
```

### Pattern 3: Query Parameter Handling
```tsx
// app/search/page.tsx
'use client';
import { useSearchParams } from 'next/navigation';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  
  return <div>Searching for: {query}</div>;
}
```

---

## Summary

1. **File-based routing**: Folders = routes
2. **Layouts**: Wrap routes, persist across navigation
3. **Redirects**: Use `redirect()` or `next.config.ts`
4. **Middleware**: Protect routes at the edge
5. **Dynamic routes**: Use `[param]` for dynamic segments
6. **Route groups**: Use `(group)` for organization without URL changes
7. **API routes**: Use `route.ts` files in `app/api`
8. **Best practices**: Centralize routes, use type safety, handle errors

