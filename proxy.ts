// middleware.ts (in root directory)

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
    // Clone headers and add pathname
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-pathname', request.nextUrl.pathname);

    let supabaseResponse = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error('Middleware: Missing Supabase environment variables');
        return supabaseResponse;
    }

    const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
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
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    supabaseResponse.cookies.set({
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
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    supabaseResponse.cookies.set({
                        name,
                        value: '',
                        ...options,
                    });
                },
            },
        }
    );

    try {
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

        return supabaseResponse;
    } catch (e) {
        console.error('Middleware Error:', e);
        return supabaseResponse;
    }
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};