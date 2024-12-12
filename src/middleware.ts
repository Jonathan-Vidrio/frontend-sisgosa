import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from './app/lib/session/session';
import { getDevelopment } from './app/lib/config/config';

// Define public routes that do not require authentication
const publicRoutes = [/^\/sign-in$/, /^\/sign-up$/, /^\/verify$/, /^\/password-recovery$/, /^\/password-reset$/];

// Define role-based routes
const roleRoutes = {
  client: [
    /^\/settings(\/change-email|\/change-password)?$/,
    /^\/appointments(\/history|\/create|\/details\/[\w-]+)?$/,
    /^\/services(\/history|\/details\/[\w-]+(\/resources\/details\/[\w-]+|\/service-detail\/details\/[\w-]+)?)?$/,
    /^\/vehicles(\/create|\/details\/[\w-]+|\/update\/[\w-]+)?$/,
    /^\/products\/details\/[\w-]+$/,
  ],
  worker: [
    /^\/settings(\/change-email|\/change-password)?$/,
    /^\/appointments(\/history|\/details\/[\w-]+)?$/,
    /^\/services(\/history|\/details\/[\w-]+(\/resources\/create|\/resources\/details\/[\w-]+|\/service-detail\/create|\/service-detail\/details\/[\w-]+)?)?$/,
    /^\/vehicles\/details\/[\w-]+$/,
    /^\/products\/details\/[\w-]+$/,
  ],
  receptionist: [/^\/.*$/],
  admin: 'receptionist',
  superAdmin: 'receptionist',
};

type RoleType = keyof typeof roleRoutes;

/**
 * @function middleware
 * @description Middleware function to handle route access based on user authentication and permissions
 *
 * @param {NextRequest} request - The incoming request object
 * @returns {Promise<NextResponse>} The response object
 *
 * @example
 * export default async function middleware(request: NextRequest) {
 *   // Middleware logic
 * }
 */
export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the project is in development mode
  const isDevelopment = await getDevelopment();

  // Add /docs route to publicRoutes only if in development mode
  if (isDevelopment) {
    publicRoutes.push(/^\/docs\/.*$/);
  }

  const isPublicRoute = publicRoutes.some(route => route.test(pathname));
  const isPrivateRoute = !isPublicRoute;

  try {
    // Redirect /docs to /docs/index.html if in development mode
    if (isDevelopment && pathname === '/docs') {
      return NextResponse.redirect(new URL('/docs/index.html', request.nextUrl));
    }

    const sessionCookie = (await cookies()).get('session')?.value;
    if (!sessionCookie && isPrivateRoute) return NextResponse.redirect(new URL('/sign-in', request.nextUrl));
    if (isPublicRoute && !sessionCookie) return NextResponse.next();

    if (!sessionCookie) return NextResponse.next();
    const payload = await decrypt(sessionCookie);
    if (!payload || !payload.accessToken) return NextResponse.redirect(new URL('/sign-in', request.nextUrl));

    const permissions = payload.permissions as string[];

    let role: RoleType = 'client';

    if (permissions.includes('superAdmin')) role = 'superAdmin';
    if (permissions.includes('admin')) role = 'admin';
    if (permissions.includes('receptionist')) role = 'receptionist';
    if (permissions.includes('worker')) role = 'worker';

    let allowedRoutes = roleRoutes[role as RoleType];
    if (typeof allowedRoutes === 'string') allowedRoutes = roleRoutes[allowedRoutes as RoleType];

    const isAllowed = (allowedRoutes as RegExp[]).some(route => route.test(pathname)) || isPublicRoute;
    if (!isAllowed) return NextResponse.redirect(new URL('/sign-in', request.nextUrl));
    if (isPublicRoute) return NextResponse.redirect(new URL('/appointments', request.nextUrl));

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware Error:', error);
    return new Response('An error occurred', { status: 500 });
  }
}

/**
 * @constant config
 * @description Configuration object for the middleware matcher
 *
 * @property {string[]} matcher - Array of paths to match for the middleware
 */
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
