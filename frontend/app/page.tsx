import { getLocale, getTranslations } from "next-intl/server";
import { Metadata } from "next";
import AboutSection from "@/components/server/About";
import FAQSection from "@/components/server/Faq";
import Form from "@/components/server/Form";
import HeroSection from "@/components/server/Hero";
import ProductsSection from "@/components/server/Products";
import ScrollMain from "@/components/server/ScrollMain";
import StagesSection from "@/components/server/Stages";

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getLocale();
    const t = await getTranslations({ locale, namespace: "metadata" });

    const baseUrl = "https://asiataren.uz";

    return {
        title: t("title"),
        description: t("description"),
        keywords: t("keywords"),

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
                    url: "/images/og-image.webp",
                    width: 1200,
                    height: 630,
                    alt: "Asia Toren - Производство оборудования для птицеводства",
                },
            ],
        },

        twitter: {
            card: "summary_large_image",
            title: t("title"),
            description: t("description"),
            images: ["/images/og-image.webp"],
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

        authors: [{ name: "Asia Toren" }],
        creator: "Asia Toren",
        publisher: "Asia Toren",
    };
}

export default async function Home() {
    const locale = await getLocale();
    const t = await getTranslations({ locale, namespace: "home" });

    const jsonLdOrganization = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Asia Toren",
        url: "https://asiataren.uz",
        logo: "https://asiataren.uz/logo.png",
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
        name: "Asia Toren",
        url: "https://asiataren.uz",
        description: t("description"),
        inLanguage: locale,
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

            <div>
                {/* Hero section */}
                <HeroSection />

                {/* Scroll Section */}
                <ScrollMain />

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
