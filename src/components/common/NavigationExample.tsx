/**
 * Example component showing how to use the custom navigation utilities
 * This is a reference file - you can delete it or use it as a template
 */

'use client';

import { useAppRouter, isActiveRoute } from '@/lib/navigation';
import { ROUTES } from '@/config/routes';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function NavigationExample() {
  const router = useAppRouter();
  const pathname = usePathname();

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Navigation Examples</h2>
      
      {/* Using the custom hook */}
      <div className="space-y-2">
        <h3 className="font-semibold">Using useAppRouter Hook:</h3>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={router.goToSignIn}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Go to Sign In
          </button>
          <button
            onClick={router.goToDashboard}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Go to Dashboard
          </button>
          <button
            onClick={router.goBack}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Go Back
          </button>
        </div>
      </div>

      {/* Using route constants */}
      <div className="space-y-2">
        <h3 className="font-semibold">Using Route Constants:</h3>
        <div className="flex gap-2 flex-wrap">
          <Link
            href={ROUTES.AUTH.SIGNIN}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Sign In (Link)
          </Link>
          <Link
            href={ROUTES.AUTH.SIGNUP}
            className="px-4 py-2 bg-purple-500 text-white rounded"
          >
            Sign Up (Link)
          </Link>
          <Link
            href={ROUTES.DASHBOARD}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Dashboard (Link)
          </Link>
        </div>
      </div>

      {/* Active route checking */}
      <div className="space-y-2">
        <h3 className="font-semibold">Active Route Check:</h3>
        <div className="space-y-1">
          <p>
            Is Dashboard active?{' '}
            <span className={isActiveRoute(pathname, ROUTES.DASHBOARD) ? 'text-green-500' : 'text-red-500'}>
              {isActiveRoute(pathname, ROUTES.DASHBOARD) ? 'Yes' : 'No'}
            </span>
          </p>
          <p>
            Is Auth route active?{' '}
            <span className={isActiveRoute(pathname, ROUTES.AUTH.SIGNIN) ? 'text-green-500' : 'text-red-500'}>
              {isActiveRoute(pathname, ROUTES.AUTH.SIGNIN) ? 'Yes' : 'No'}
            </span>
          </p>
        </div>
      </div>

      {/* Current pathname */}
      <div className="space-y-2">
        <h3 className="font-semibold">Current Route:</h3>
        <p className="text-gray-600 dark:text-gray-400">{pathname}</p>
      </div>
    </div>
  );
}

