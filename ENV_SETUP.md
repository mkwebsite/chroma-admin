# Environment Variables Setup

## Quick Start

1. **Create `.env.local` file** in the root directory:
```bash
# Server Port
PORT=3000

# API Base URL (Client-side - must start with NEXT_PUBLIC_)
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# API Base URL (Server-side only)
API_URL=http://localhost:3000/api

# Environment
NODE_ENV=development
```

2. **For production**, create `.env.production`:
```bash
PORT=3000
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
API_URL=https://api.yourdomain.com
NODE_ENV=production
```

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port number | `3000` |
| `NEXT_PUBLIC_API_URL` | API base URL (accessible in browser) | `http://localhost:3000/api` |
| `API_URL` | API base URL (server-side only) | `http://localhost:3000/api` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |

## Usage in Code

### Client-Side (Browser)

```tsx
import { API_ENDPOINTS, API_URL } from '@/config/env';

// Use API endpoints
const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
  method: 'POST',
  body: JSON.stringify({ email, password }),
});

// Or use base URL directly
const response = await fetch(`${API_URL.CLIENT}/auth/login`, {
  method: 'POST',
  body: JSON.stringify({ email, password }),
});
```

### Server-Side

```tsx
import { API_URL } from '@/config/env';

// Use server-side API URL
const response = await fetch(`${API_URL.SERVER}/auth/login`, {
  method: 'POST',
  body: JSON.stringify({ email, password }),
});
```

## Available API Endpoints

The following endpoints are pre-configured in `src/config/env.ts`:

- `API_ENDPOINTS.AUTH.LOGIN` - User login
- `API_ENDPOINTS.AUTH.LOGOUT` - User logout
- `API_ENDPOINTS.AUTH.REGISTER` - User registration
- `API_ENDPOINTS.AUTH.REFRESH` - Refresh token
- `API_ENDPOINTS.AUTH.FORGOT_PASSWORD` - Request password reset
- `API_ENDPOINTS.AUTH.RESET_PASSWORD` - Reset password
- `API_ENDPOINTS.AUTH.VERIFY_EMAIL` - Verify email address
- `API_ENDPOINTS.USER.PROFILE` - Get user profile
- `API_ENDPOINTS.USER.UPDATE_PROFILE` - Update user profile

## Running the Application

### Development
```bash
npm run dev
# Server will run on port specified in PORT env variable (default: 3000)
```

### Production
```bash
npm run build
npm start
# Server will run on port specified in PORT env variable
```

## Important Notes

1. **NEXT_PUBLIC_ Prefix**: Variables that need to be accessible in the browser MUST start with `NEXT_PUBLIC_`. Without this prefix, the variable will only be available on the server.

2. **Security**: Never commit `.env.local` or `.env.production` to version control. They are already in `.gitignore`.

3. **Environment Files Priority**:
   - `.env.local` (highest priority, not committed)
   - `.env.development` / `.env.production` (based on NODE_ENV)
   - `.env` (lowest priority)

4. **Restart Required**: After changing environment variables, you must restart the Next.js development server.

## Example API Integration

The `AuthContext` is already configured to use the API URL from environment variables:

```tsx
// src/context/AuthContext.tsx
import { API_ENDPOINTS } from '@/config/env';

// Login function uses API_ENDPOINTS.AUTH.LOGIN
const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});
```

## Troubleshooting

### Issue: Environment variables not working
- Make sure the variable name starts with `NEXT_PUBLIC_` for client-side access
- Restart the development server after changing `.env` files
- Check that the file is named correctly (`.env.local`, not `.env.local.txt`)

### Issue: API calls failing
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check that your API server is running
- Verify CORS settings on your API server

### Issue: Port already in use
- Change the `PORT` value in `.env.local`
- Or kill the process using the port: `npx kill-port 3000`

