/**
 * Environment variables configuration
 * Centralized access to environment variables with type safety
 */

/**
 * Get the API URL for client-side requests
 * Must use NEXT_PUBLIC_ prefix to be accessible in the browser
 */
export const API_URL = {
  CLIENT: process.env.NEXT_PUBLIC_API_URL,
  SERVER: process.env.API_URL || process.env.NEXT_PUBLIC_API_URL,
} as const;

/**
 * Get the server port
 */
export const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

/**
 * Get the current environment
 */
export const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Check if running in development mode
 */
export const IS_DEV = NODE_ENV === 'development';

/**
 * Check if running in production mode
 */
export const IS_PROD = NODE_ENV === 'production';

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_URL.CLIENT}/auth/login`,
    LOGOUT: `${API_URL.CLIENT}/auth/logout`,
    REGISTER: `${API_URL.CLIENT}/auth/register`,
    REFRESH: `${API_URL.CLIENT}/auth/refresh`,
    FORGOT_PASSWORD: `${API_URL.CLIENT}/auth/forgot-password`,
    RESET_PASSWORD: `${API_URL.CLIENT}/auth/reset-password`,
    VERIFY_EMAIL: `${API_URL.CLIENT}/auth/verify-email`,
  },
  USER: {
    PROFILE: `${API_URL.CLIENT}/user/profile`,
    UPDATE_PROFILE: `${API_URL.CLIENT}/user/profile`,
  },
  ROLES: {
    LIST: `${API_URL.CLIENT}/roles`,
    CREATE: `${API_URL.CLIENT}/roles`,
    UPDATE: (id: string) => `${API_URL.CLIENT}/roles/${id}`,
    DELETE: (id: string) => `${API_URL.CLIENT}/roles/${id}`,
    GET: (id: string) => `${API_URL.CLIENT}/roles/${id}`,
  },
  USERS: {
    LIST: `${API_URL.CLIENT}/users`,
    CREATE: `${API_URL.CLIENT}/users`,
    UPDATE: (id: string) => `${API_URL.CLIENT}/users/${id}`,
    DELETE: (id: string) => `${API_URL.CLIENT}/users/${id}`,
    GET: (id: string) => `${API_URL.CLIENT}/users/${id}`,
  },
} as const;

/**
 * Validate that required environment variables are set
 */
export function validateEnv() {
  const required = ['NEXT_PUBLIC_API_URL'];
  const missing: string[] = [];

  required.forEach((key) => {
    if (!process.env[key]) {
      missing.push(key);
    }
  });

  if (missing.length > 0 && IS_PROD) {
    console.error('Missing required environment variables:', missing.join(', '));
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  if (missing.length > 0 && IS_DEV) {
    console.warn('Missing environment variables (using defaults):', missing.join(', '));
  }
}

// Validate on import in development
if (typeof window === 'undefined' && IS_DEV) {
  validateEnv();
}

