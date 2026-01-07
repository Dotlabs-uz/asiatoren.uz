import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const authToken = request.cookies.get("authToken")?.value;

    console.log("[Middleware]", { pathname, hasToken: !!authToken });

    // Если это страница логина
    if (pathname === "/login") {
        // Если уже авторизован - редирект на главную (dashboard)
        if (authToken) {
            console.log("[Middleware] Redirecting to dashboard");
            return NextResponse.redirect(new URL("/", request.url));
        }
        console.log("[Middleware] Allowing access to login");
        return NextResponse.next();
    }

    // Список админ путей (все кроме главной страницы фронта)
    const adminPaths = [
        "/applications",
        "/categories",
        "/products",
        "/media",
    ];

    // Если это админ путь ИЛИ главная страница (/)
    // проверяем токен
    const isAdminPath = adminPaths.some((path) => pathname.startsWith(path));
    const isRootPath = pathname === "/";

    if (isAdminPath || isRootPath) {
        // Для админских путей проверяем токен
        if (!authToken) {
            console.log("[Middleware] No token, redirecting to login");
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    console.log("[Middleware] Token found or public path, allowing access");
    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};