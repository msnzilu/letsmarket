// middleware.ts (in root directory)

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    // Set x-pathname for internal routing/breadcrumbs
    request.headers.set('x-pathname', request.nextUrl.pathname);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        return supabaseResponse;
    }

    // Track corrupted cookies to clear them
    const corruptedCookies: string[] = [];

    const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                get(name: string) {
                    try {
                        return request.cookies.get(name)?.value;
                    } catch (error) {
                        // Handle corrupted cookies (Invalid UTF-8 sequence)
                        console.error(`Error reading cookie ${name}:`, error);
                        corruptedCookies.push(name);
                        return undefined;
                    }
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    });
                    supabaseResponse = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
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
                        request: {
                            headers: request.headers,
                        },
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
        // If corrupted cookies were detected, clear them and redirect to login
        if (corruptedCookies.length > 0) {
            console.error('Corrupted cookies detected, clearing and redirecting to login:', corruptedCookies);
            const redirectUrl = request.nextUrl.clone();
            redirectUrl.pathname = '/login';
            redirectUrl.searchParams.set('session_expired', 'true');
            
            const response = NextResponse.redirect(redirectUrl);
            
            // Clear all Supabase auth cookies
            const cookiesToClear = [
                'sb-access-token',
                'sb-refresh-token',
                ...corruptedCookies,
            ];
            
            // Also clear any cookies that start with sb- (Supabase prefix)
            request.cookies.getAll().forEach(cookie => {
                if (cookie.name.startsWith('sb-')) {
                    cookiesToClear.push(cookie.name);
                }
            });
            
            // Remove duplicates and clear cookies
            [...new Set(cookiesToClear)].forEach(name => {
                response.cookies.set(name, '', { maxAge: 0, path: '/' });
            });
            
            return response;
        }

        // This will refresh the session if needed
        const { data: { user } } = await supabase.auth.getUser();

        const path = request.nextUrl.pathname;

        // Protected routes check
        const protectedRoutes = ['/dashboard', '/analyze', '/connections', '/posts', '/campaigns', '/profile'];
        const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));

        if (isProtectedRoute && !user) {
            const redirectUrl = request.nextUrl.clone();
            redirectUrl.pathname = '/login';
            redirectUrl.searchParams.set('redirectedFrom', path);
            return NextResponse.redirect(redirectUrl);
        }

        // Auth page check
        const authRoutes = ['/login', '/signup'];
        if (authRoutes.includes(path) && user) {
            const redirectUrl = request.nextUrl.clone();
            redirectUrl.pathname = '/dashboard';
            return NextResponse.redirect(redirectUrl);
        }

        return supabaseResponse;
    } catch (error) {
        console.error('Middleware execution error:', error);
        
        // If error is UTF-8 related, clear cookies and redirect
        if (error instanceof Error && error.message.includes('UTF-8')) {
            const redirectUrl = request.nextUrl.clone();
            redirectUrl.pathname = '/login';
            redirectUrl.searchParams.set('session_expired', 'true');
            
            const response = NextResponse.redirect(redirectUrl);
            
            // Clear all Supabase cookies
            request.cookies.getAll().forEach(cookie => {
                if (cookie.name.startsWith('sb-')) {
                    response.cookies.set(cookie.name, '', { maxAge: 0, path: '/' });
                }
            });
            
            return response;
        }
        
        return supabaseResponse;
    }
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};