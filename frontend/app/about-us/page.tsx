import { AboutPageClient } from "@/components/client/AboutPage";
import {
    getCertificatesServer,
    getPartnersServer,
} from "@/lib/firebase/server-api";
import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

// ============ ПОЛНЫЕ SEO МЕТАДАННЫЕ ============
export async function generateMetadata(): Promise<Metadata> {
    const locale = await getLocale();
    const t = await getTranslations({ locale, namespace: "about" });

    return {
        title: t("title"),
        description: t("description"),
        keywords: [
            "Asia Toren о компании",
            "производитель оборудования для птицеводства",
            "история компании",
            "наша команда",
        ],
        alternates: {
            canonical: "https://asiatoren.uz/about-us",
            languages: {
                ru: "https://asiatoren.uz/about-us?lang=ru",
                uz: "https://asiatoren.uz/about-us?lang=uz",
                en: "https://asiatoren.uz/about-us?lang=en",
            },
        },
        openGraph: {
            type: "website",
            locale: locale,
            url: "https://asiatoren.uz/about-us",
            siteName: "Asia Toren",
            title: t("title"),
            description: t("description"),
            images: [
                {
                    url: "/logo.svg",
                    width: 1200,
                    height: 630,
                    alt: "О компании Asia Toren",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: t("title"),
            description: t("description"),
            images: ["/logo.svg"],
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
            },
        },
        authors: [{ name: "Asia Toren" }],
    };
}

export default async function AboutPage() {
    const locale = await getLocale();
    const t = await getTranslations("about-page");
    const t1 = await getTranslations("about-us");
    const certificates = await getCertificatesServer();
    const partners = await getPartnersServer();

    const aboutTranslations = {
        subtitle: t1("subtitle"),
        title: t1("title"),
        p1: t1("p1"),
        p2: t1("p2"),
        stats: [
            {
                number: t1("stats.0.number"),
                label: t1("stats.0.label"),
            },
            {
                number: t1("stats.1.number"),
                label: t1("stats.1.label"),
            },
            {
                number: t1("stats.2.number"),
                label: t1("stats.2.label"),
            },
            {
                number: t1("stats.3.number"),
                label: t1("stats.3.label"),
            },
        ],
    };

    const translations = {
        hero: {
            title: t("hero.title"),
            subtitle: t("hero.subtitle"),
        },
        sections: {
            aboutCompany: t("sections.aboutCompany"),
            equipment: {
                title: t("sections.equipment.title"),
                production: t("sections.equipment.production"),
                description: t("sections.equipment.description"),
            },
            stages: {
                subtitle: t("sections.stages.subtitle"),
                title: t("sections.stages.title"),
                clientTasks: t("sections.stages.clientTasks"),
                step1: {
                    title: t("sections.stages.step1.title"),
                    description: t("sections.stages.step1.description"),
                },
                step2: {
                    title: t("sections.stages.step2.title"),
                    description: t("sections.stages.step2.description"),
                },
                step3: {
                    title: t("sections.stages.step3.title"),
                    description: t("sections.stages.step3.description"),
                },
                step4: {
                    title: t("sections.stages.step4.title"),
                    description: t("sections.stages.step4.description"),
                },
            },
            certificates: {
                label: t("sections.certificates.label"),
                title: t("sections.certificates.title"),
                p1: t("sections.certificates.p1"),
                p2: t("sections.certificates.p2"),
            },
            partners: {
                label: t("sections.partners.label"),
                title: t("sections.partners.title"),
                p1: t("sections.partners.p1"),
                p2: t("sections.partners.p2"),
            },
        },
    };

    const jsonLdAboutPage = {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: t("hero.title"),
        description: t("hero.subtitle"),
        url: "https://asiatoren.uz/about-us",
        inLanguage: locale,
    };

    const jsonLdOrganization = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Asia Toren",
        url: "https://asiatoren.uz",
        logo: "https://asiatoren.uz/logo.png",
        description: t1("p1"),

        address: {
            "@type": "PostalAddress",
            addressCountry: "UZ",
            addressLocality: "Samarkand",
            streetAddress: "Dahbed",
        },

        contactPoint: {
            "@type": "ContactPoint",
            telephone: "+998-77-201-3131",
            contactType: "customer service",
            availableLanguage: ["Russian", "Uzbek", "English"],
        },

        sameAs: [
            "https://www.instagram.com/asiatarenuz",
            "https://t.me/Asia_Taren_Poultry",
        ],
    };

    const jsonLdCertifications =
        certificates.length > 0
            ? {
                  "@context": "https://schema.org",
                  "@type": "Organization",
                  name: "Asia Toren",
                  hasCredential: certificates.map((cert) => ({
                      "@type": "EducationalOccupationalCredential",
                      name: cert.title || "Certificate",
                      credentialCategory: "certification",
                      ...(cert.imageUrl && { image: cert.imageUrl }),
                  })),
              }
            : null;

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(jsonLdAboutPage),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(jsonLdOrganization),
                }}
            />
            {jsonLdCertifications && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(jsonLdCertifications),
                    }}
                />
            )}

            <AboutPageClient
                translations={translations}
                aboutSectionTranslations={aboutTranslations}
                certificates={certificates}
                partners={partners}
            />
        </>
    );
}
