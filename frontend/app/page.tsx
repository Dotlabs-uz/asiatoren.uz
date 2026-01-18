import { getLocale, getTranslations } from "next-intl/server";
import { Metadata } from "next";
import AboutSection from "@/components/server/About";
import FAQSection from "@/components/server/Faq";
import Form from "@/components/server/Form";
import HeroSection from "@/components/server/Hero";
import ProductsSection from "@/components/server/Products";
import ScrollMain from "@/components/server/ScrollMain";
import StagesSection from "@/components/server/Stages";
import { getBannersServer } from "@/lib/firebase/server-api";
import { BannerCarousel } from "@/components/client/BannerCarousel";
import { Suspense } from "react";

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getLocale();
    const t = await getTranslations({ locale, namespace: "metadata" });

    const baseUrl = "https://www.asiataren.uz";

    return {
        title: t("title"),
        description: t("description"),
        keywords: t("keywords"),

        icons: {
            icon: [
                { url: "/favicon.ico" },
                { url: "/icon.png", sizes: "512x512", type: "image/png" },
            ],
            shortcut: "/favicon.ico",
            apple: "/apple-icon.png",
        },

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
            siteName: "Asia Taren",
            title: t("title"),
            description: t("description"),
            images: [
                {
                    url: `${baseUrl}/images/og-image.webp`,
                    width: 1200,
                    height: 630,
                    alt: "Asia Taren - Производство оборудования для птицеводства",
                },
            ],
        },

        twitter: {
            card: "summary_large_image",
            title: t("title"),
            description: t("description"),
            images: [`${baseUrl}/images/og-image.webp`],
        },

        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },

        authors: [{ name: "Asia Taren" }],
        creator: "Asia Taren",
        publisher: "Asia Taren",
    };
}

export default async function Home() {
    const locale = await getLocale();
    const t = await getTranslations({ locale, namespace: "home" });
    const banners = await getBannersServer();

    const baseUrl = "https://www.asiataren.uz";

    const jsonLdOrganization = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Asia Taren",
        url: baseUrl,
        logo: `${baseUrl}/icon.png`,
        description: t("description"),

        contactPoint: {
            "@type": "ContactPoint",
            telephone: "+998-77-201-3131",
            contactType: "customer service",
            availableLanguage: ["Russian", "Uzbek", "English"],
        },

        address: {
            "@type": "PostalAddress",
            addressCountry: "UZ",
            addressLocality: "Samarkand",
            streetAddress: "Dahbed",
        },

        sameAs: [
            "https://www.instagram.com/asiatarenuz",
            "https://t.me/Asia_Taren_Poultry",
        ],

        inLanguage: locale,
    };

    const jsonLdWebSite = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Asia Taren",
        url: baseUrl,
        description: t("description"),
        inLanguage: locale,
    };

    const videoData = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: "Asia Taren - Оборудование для птицеводства",
        description:
            "Обзор оборудования и производства Asia Taren для птицеводческих хозяйств",
        thumbnailUrl: [
            "https://i.ytimg.com/vi/Riv1FdyvFxs/maxresdefault.jpg",
            "https://i.ytimg.com/vi/Riv1FdyvFxs/hqdefault.jpg",
        ],
        uploadDate: "2025-12-24T00:00:00Z",
        contentUrl: "https://www.youtube.com/watch?v=Riv1FdyvFxs",
        embedUrl: "https://www.youtube.com/embed/Riv1FdyvFxs",
        duration: "PT2M30S",
        publisher: {
            "@type": "Organization",
            name: "Asia Taren",
            logo: {
                "@type": "ImageObject",
                url: `${baseUrl}/icon.png`,
            },
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(jsonLdOrganization),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(jsonLdWebSite),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(videoData),
                }}
            />

            <div>
                {/* Hero section */}
                <HeroSection />

                {/* Scroll Section */}
                <ScrollMain />

                {/* Banners */}
                <Suspense fallback={<div>Loading....</div>}>
                    <BannerCarousel images={banners} />
                </Suspense>

                {/* Stages section */}
                <StagesSection />

                {/* Products */}
                <ProductsSection />

                {/* About Us */}
                <AboutSection />

                {/* Faq */}
                <FAQSection />

                {/* Form */}
                <Form />
            </div>
        </>
    );
}
