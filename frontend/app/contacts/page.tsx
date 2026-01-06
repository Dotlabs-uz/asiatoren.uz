import ContactsPageClient from "@/components/client/ContactsPageClient";
import { getLocale, getTranslations } from "next-intl/server";
import { Metadata } from "next";

// ============ SEO МЕТАДАННЫЕ ============
export async function generateMetadata(): Promise<Metadata> {
    const locale = await getLocale();
    const t = await getTranslations({ locale, namespace: "contacts" });

    return {
        // Основной title
        title: t("title"),

        // Описание для поисковиков
        description: t("description"),

        // Ключевые слова
        keywords: [
            "Asia Toren контакты",
            "связаться с Asia Toren",
            "адрес Asia Toren",
            "телефон Asia Toren",
            "оборудование для птицеводства контакты",
        ],

        // Canonical и языковые версии
        alternates: {
            canonical: "https://asiataren.uz/contacts",
            languages: {
                ru: "https://asiataren.uz/contacts?lang=ru",
                uz: "https://asiataren.uz/contacts?lang=uz",
                en: "https://asiataren.uz/contacts?lang=en",
            },
        },

        // OpenGraph для соцсетей
        openGraph: {
            type: "website",
            locale: locale,
            url: "https://asiataren.uz/contacts",
            siteName: "Asia Toren",
            title: t("title"),
            description: t("description"),
            images: [
                {
                    url: "/images/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: "Контакты Asia Toren",
                },
            ],
        },

        // Twitter Card
        twitter: {
            card: "summary_large_image",
            title: t("title"),
            description: t("description"),
            images: ["/images/og-image.png"],
        },

        // Robots инструкции
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
            },
        },

        // Дополнительные теги
        authors: [{ name: "Asia Toren" }],
    };
}

// ============ КОМПОНЕНТ СТРАНИЦЫ ============
export default async function ContactsPage() {
    const locale = await getLocale();
    const t = await getTranslations("contacts-page");

    const translations = {
        hero: {
            title: t("hero.title"),
            subtitle: t("hero.subtitle"),
        },
        form: {
            title: t("form.title"),
            firstName: t("form.firstName"),
            lastName: t("form.lastName"),
            phone: t("form.phone"),
            email: t("form.email"),
            message: t("form.message"),
            submit: t("form.submit"),
            sending: t("form.sending"),
            successMessage: t("form.successMessage"),
            errorMessage: t("form.errorMessage"),
            firstNameError: t("form.firstNameError"),
            lastNameError: t("form.lastNameError"),
            phoneError: t("form.phoneError"),
            emailError: t("form.emailError"),
            messageError: t("form.messageError"),
        },
        contact: {
            phone1: t("contact.phone1"),
            phone2: t("contact.phone2"),
            email: t("contact.email"),
            address1: {
                title: t("contact.address1.title"),
                address: t("contact.address1.address"),
                mapUrl: t("contact.address1.mapUrl"),
            },
            address2: {
                title: t("contact.address2.title"),
                address: t("contact.address2.address"),
                mapUrl: t("contact.address2.mapUrl"),
            },
            connectTitle: t("contact.connectTitle"),
            socialTitle: t("contact.socialTitle"),
        },
    };

    // ============ JSON-LD СТРУКТУРИРОВАННЫЕ ДАННЫЕ ============

    // ContactPage Schema
    const jsonLdContactPage = {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: t("hero.title"),
        description: t("hero.subtitle"),
        url: "https://asiataren.uz/contacts",
        inLanguage: locale,
    };

    // Organization с полными контактными данными
    const jsonLdOrganization = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Asia Toren",
        url: "https://asiataren.uz",
        logo: "https://asiataren.uz/logo.png",

        // Контактные данные
        contactPoint: [
            {
                "@type": "ContactPoint",
                telephone: translations.contact.phone1,
                contactType: "customer service",
                availableLanguage: ["Russian", "Uzbek", "English"],
                areaServed: "UZ",
            },
            {
                "@type": "ContactPoint",
                telephone: translations.contact.phone2,
                contactType: "sales",
                availableLanguage: ["Russian", "Uzbek", "English"],
                areaServed: "UZ",
            },
        ],

        // Email
        email: translations.contact.email,

        // Социальные сети (замените на свои ссылки)
        sameAs: [
            "https://www.instagram.com/asiatarenuz",
            "https://t.me/Asia_Taren_Poultry",
        ],
    };

    // LocalBusiness для первого адреса (офис/производство)
    const jsonLdLocalBusiness1 = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: "Asia Toren - " + translations.contact.address1.title,
        image: "https://asiataren.uz/office1.jpg",

        // Адрес
        address: {
            "@type": "PostalAddress",
            streetAddress: translations.contact.address1.address,
            addressLocality: "Samarkand",
            addressRegion: "Samarkand",
            addressCountry: "UZ",
        },
        geo: {
            "@type": "GeoCoordinates",
            latitude: "39.742833",
            longitude: "66.916000",
        },

        // Контакты
        telephone: translations.contact.phone1,
        email: translations.contact.email,
        url: "https://asiataren.uz",

        // Время работы (добавьте если есть)
        openingHoursSpecification: [
            {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                ],
                opens: "09:00",
                closes: "18:00",
            },
        ],
    };

    // LocalBusiness для второго адреса (если есть)
    const jsonLdLocalBusiness2 = translations.contact.address2
        ? {
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Asia Toren - " + translations.contact.address2.title,

              address: {
                  "@type": "PostalAddress",
                  streetAddress: translations.contact.address2.address,
                  addressLocality: "Tashkent",
                  addressRegion: "Tashkent",
                  addressCountry: "UZ",
              },
              geo: {
                  "@type": "GeoCoordinates",
                  latitude: "41.252889",
                  longitude: "69.301639",
              },
              telephone: translations.contact.phone2,
              email: translations.contact.email,
              url: "https://asiataren.uz",
          }
        : null;

    // BreadcrumbList
    const jsonLdBreadcrumb = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Главная",
                item: "https://asiataren.uz",
            },
            {
                "@type": "ListItem",
                position: 2,
                name: t("hero.title"),
                item: "https://asiataren.uz/contacts",
            },
        ],
    };

    return (
        <>
            {/* ============ СТРУКТУРИРОВАННЫЕ ДАННЫЕ ============ */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(jsonLdContactPage),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(jsonLdOrganization),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(jsonLdLocalBusiness1),
                }}
            />
            {jsonLdLocalBusiness2 && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(jsonLdLocalBusiness2),
                    }}
                />
            )}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(jsonLdBreadcrumb),
                }}
            />

            <ContactsPageClient translations={translations} />
        </>
    );
}
