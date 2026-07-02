import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Liste des routes publiques qui ne nécessitent pas d'authentification
  const publicRoutes = ['/login', '/login/forgot-password', '/login/reset-password'];
  const isPublicRoute = publicRoutes.some((route) => request.nextUrl.pathname.startsWith(route));

  // Récupérer le token depuis les cookies
  const token = request.cookies.get('token')?.value;
  const userCookie = request.cookies.get('user')?.value;

  // Si la route n'est pas publique et qu'il n'y a pas de token, rediriger vers login
  if (!isPublicRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    // Optionnel: on peut passer l'url de retour en query param
    // loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Si l'utilisateur est déjà connecté et essaie d'accéder à /login, le rediriger vers le dashboard
  if (isPublicRoute && token && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // ==== RBAC (Role-Based Access Control) ====
  // On récupère les infos de l'utilisateur depuis le cookie 'user'
  if (userCookie && request.nextUrl.pathname.startsWith('/dashboard')) {
    try {
      const user = JSON.parse(userCookie);
      const role = user.role?.name || user.role; // Ajuster selon comment le backend renvoie le rôle

      // Exemple de protection : /dashboard/users ou /dashboard/settings
      // Si la route commence par /dashboard/users et le rôle n'est pas ADMIN
      const adminOnlyRoutes = [
        '/dashboard/users',
        '/dashboard/settings',
        '/dashboard/roles',
      ];

      const isAdminOnly = adminOnlyRoutes.some(route => request.nextUrl.pathname.startsWith(route));

      if (isAdminOnly && role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch (e) {
      console.error('Erreur parsing user cookie in middleware', e);
    }
  }

  return NextResponse.next();
}

// Spécifier sur quelles routes le middleware doit s'exécuter
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
