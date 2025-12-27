# Authentication Setup Guide

## Overview

Your application now has complete authentication protection. Users who are not logged in will be automatically redirected to the login page.

## How It Works

### 1. **Server-Side Protection (Middleware)**
The `middleware.ts` file protects routes at the edge before the request reaches your pages:

- **Protected Routes**: All admin routes, dashboard, profile, calendar, and other app pages
- **Auth Routes**: Sign in and sign up pages
- **Behavior**:
  - Unauthenticated users → Redirected to `/auth/signin` with `returnUrl` parameter
  - Authenticated users → Redirected away from auth pages to dashboard

### 2. **Client-Side Protection (AuthContext)**
The `AuthContext` provides authentication state management:

- **AuthProvider**: Wraps the entire app in `src/app/layout.tsx`
- **useAuth Hook**: Provides authentication state and methods
- **ProtectedRoute Component**: Client-side route protection wrapper

### 3. **Protected Routes**

Routes are protected in two ways:

1. **Middleware** (server-side) - Checks for `auth-token` cookie
2. **ProtectedRoute Component** (client-side) - Wraps protected layouts

## Protected Routes List

The following routes require authentication:

- `/` (Home/Dashboard)
- `/admin/*` (All admin routes)
- `/dashboard`
- `/profile`
- `/calendar`
- `/form-elements`
- `/basic-tables`
- `/blank`
- `/line-chart`
- `/bar-chart`
- `/alerts`
- `/avatars`
- `/badge`
- `/buttons`
- `/images`
- `/videos`
- `/modals`

## Usage

### Sign In Form

The sign-in form (`SignInForm.tsx`) now:
- ✅ Validates email and password
- ✅ Calls the `login()` function from AuthContext
- ✅ Sets authentication token in cookies
- ✅ Redirects to dashboard (or returnUrl) after successful login
- ✅ Shows error messages on failure

**To test login:**
- Enter any email and password
- Click "Sign in"
- You'll be redirected to the dashboard

### Sign Out

The user dropdown now:
- ✅ Uses the `logout()` function from AuthContext
- ✅ Clears authentication token
- ✅ Redirects to sign-in page

### Using Auth in Components

```tsx
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please log in</div>;
  
  return (
    <div>
      <p>Welcome, {user?.name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protecting a New Route

**Option 1: Add to Middleware**
```ts
// middleware.ts
const protectedRoutes = [
  // ... existing routes
  '/new-route',
];
```

**Option 2: Wrap with ProtectedRoute**
```tsx
// app/new-route/page.tsx
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function NewRoute() {
  return (
    <ProtectedRoute>
      <div>Protected content</div>
    </ProtectedRoute>
  );
}
```

## Customization

### Change Cookie Name

Edit `middleware.ts` and `src/context/AuthContext.tsx`:
```ts
// Change from 'auth-token' to your preferred name
const token = request.cookies.get('your-token-name')?.value;
```

### Connect to Real API

Update the `login` function in `src/context/AuthContext.tsx`:

```tsx
const login = async (email: string, password: string) => {
  setIsLoading(true);
  
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      throw new Error('Invalid credentials');
    }
    
    const data = await response.json();
    
    // Set token
    document.cookie = `auth-token=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}`;
    
    // Store user
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    
    // Redirect
    const returnUrl = new URLSearchParams(window.location.search).get('returnUrl');
    router.push(returnUrl || ROUTES.DASHBOARD);
  } catch (error) {
    throw error;
  } finally {
    setIsLoading(false);
  }
};
```

### Add More Protected Routes

Edit `middleware.ts`:
```ts
const protectedRoutes = [
  // ... existing
  '/your-new-route',
  '/another-route',
];
```

## Testing

1. **Test Unauthenticated Access:**
   - Clear cookies or open incognito
   - Try to access `/` or any protected route
   - Should redirect to `/auth/signin`

2. **Test Login:**
   - Go to `/auth/signin`
   - Enter any email/password
   - Click "Sign in"
   - Should redirect to dashboard

3. **Test Logout:**
   - While logged in, click user dropdown
   - Click "Sign out"
   - Should redirect to sign-in page

4. **Test Auth Pages Redirect:**
   - While logged in, try to access `/auth/signin`
   - Should redirect to dashboard

## Troubleshooting

### Issue: Not redirecting to login
- Check that `middleware.ts` is in the root directory
- Verify the route is in the `protectedRoutes` array
- Check browser console for errors

### Issue: Login not working
- Check browser console for errors
- Verify `AuthProvider` is in root layout
- Check that cookies are being set (DevTools → Application → Cookies)

### Issue: Infinite redirect loop
- Check that auth routes are not in protected routes
- Verify middleware matcher configuration
- Check for conflicting redirects

## Security Notes

⚠️ **Current Implementation is for Demo:**
- The login function uses mock authentication
- In production, you MUST:
  - Connect to a real authentication API
  - Validate tokens server-side
  - Use secure, httpOnly cookies
  - Implement proper session management
  - Add CSRF protection
  - Use HTTPS

## Next Steps

1. ✅ Authentication protection is set up
2. 🔄 Connect to your authentication API
3. 🔄 Implement token refresh
4. 🔄 Add role-based access control (if needed)
5. 🔄 Add password reset functionality

