import { NextRequest, NextResponse } from "next/server";

const locales = ["ru", "uz", "en"];
const defaultLocale = "ru";

export function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl;

    // Получаем язык из URL параметра (?lang=uz)
    const langParam = searchParams.get("lang");

    // Получаем язык из cookies
    const cookieLocale = request.cookies.get("locale")?.value;

    // Определяем текущий язык
    let locale = defaultLocale;

    if (langParam && locales.includes(langParam)) {
        locale = langParam;
    } else if (cookieLocale && locales.includes(cookieLocale)) {
        locale = cookieLocale;
    } else {
        // Определяем из браузера
        const browserLang = request.headers
            .get("accept-language")
            ?.split(",")[0]
            .split("-")[0];
        if (browserLang && locales.includes(browserLang)) {
            locale = browserLang;
        }
    }

    const response = NextResponse.next();

    // Устанавливаем cookie с языком
    if (locale !== cookieLocale) {
        response.cookies.set("locale", locale, {
            path: "/",
            maxAge: 31536000, // 1 год
        });
    }

    return response;
}

export const config = {
    matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
