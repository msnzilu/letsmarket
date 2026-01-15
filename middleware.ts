// middleware.ts (in root directory)

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    // Clone headers and add pathname
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-pathname', request.nextUrl.pathname);

    let response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    });
                    response = NextResponse.next({
                        request: {
                            headers: requestHeaders,
                        },
                    });
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    });
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    });
                    response = NextResponse.next({
                        request: {
                            headers: requestHeaders,
                        },
                    });
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    });
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    // Protected routes that require authentication
    const protectedRoutes = ['/dashboard', '/analyze', '/connections', '/posts', '/campaigns', '/profile'];
    const isProtectedRoute = protectedRoutes.some(route =>
        request.nextUrl.pathname.startsWith(route)
    );

    // Redirect to login if accessing protected route without authentication
    if (isProtectedRoute && !user) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Redirect to dashboard if accessing auth pages while logged in
    const authRoutes = ['/login', '/signup'];
    const isAuthRoute = authRoutes.includes(request.nextUrl.pathname);

    if (isAuthRoute && user) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return response;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};