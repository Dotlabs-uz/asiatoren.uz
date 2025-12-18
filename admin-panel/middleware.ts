import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const authToken = request.cookies.get("authToken")?.value;

    console.log("[Middleware]", { pathname, hasToken: !!authToken });

    // Если это страница логина
    if (pathname === "/admin/login") {
        // Если уже авторизован - редирект на dashboard
        if (authToken) {
            console.log(
                "[Middleware] Redirecting to dashboard (already has token)"
            );
            return NextResponse.redirect(
                new URL("/admin/dashboard", request.url)
            );
        }
        console.log("[Middleware] Allowing access to login page");
        return NextResponse.next();
    }

    // Для всех остальных админских страниц проверяем токен
    if (!authToken) {
        console.log("[Middleware] No token, redirecting to login");
        return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    console.log("[Middleware] Token found, allowing access");
    return NextResponse.next();
}

export const config = {
    matcher: "/admin/:path*",
};
