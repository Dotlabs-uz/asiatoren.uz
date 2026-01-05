import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/server/Header";
import Footer from "@/components/server/Footer";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getLocale();
    const t = await getTranslations({ locale, namespace: "metadata" });

    const baseUrl = "https://asiatoren.uz";

    return {
        metadataBase: new URL(baseUrl),
        title: {
            default: t("title"),
            template: `%s | Asia Toren`,
        },
        description: t("description"),
        keywords: t("keywords"),
        // Важно! Альтернативные языковые версии
        alternates: {
            canonical: baseUrl,
            languages: {
                ru: `${baseUrl}?lang=ru`,
                uz: `${baseUrl}?lang=uz`,
                en: `${baseUrl}?lang=en`,
            },
        },
        openGraph: {
            type: "website",
            locale: locale,
            url: baseUrl,
            siteName: "Asia Toren",
            title: t("title"),
            description: t("description"),
            images: [
                {
                    url: "/images/og-image.png",
                    width: 1200,
                    height: 630,
                },
            ],
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const locale = await getLocale();
    const messages = await getMessages();
    return (
        <html lang={locale}>
            <head>
                <link
                    rel="alternate"
                    hrefLang="ru"
                    href="https://asiatoren.uz?lang=ru"
                />
                <link
                    rel="alternate"
                    hrefLang="uz"
                    href="https://asiatoren.uz?lang=uz"
                />
                <link
                    rel="alternate"
                    hrefLang="en"
                    href="https://asiatoren.uz?lang=en"
                />
                <link
                    rel="alternate"
                    hrefLang="x-default"
                    href="https://asiatoren.uz"
                />
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <NextIntlClientProvider messages={messages}>
                    <Header />
                    {children}
                    <Toaster />
                    <Footer />
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
